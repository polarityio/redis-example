'use strict';

let redis = require('redis');
let _ = require('lodash');
let async = require('async');
let Logger;
let client;
let clientOptions;

/**
 * This method is called once when the integration is first started.  It is passed a Bunyan logging object
 * that we can save and use to log data to the integration log file.
 * @param logger
 */
function startup(logger) {
    Logger = logger;
}

function doLookup(entities, options, cb) {
    let lookupResults = [];

    Logger.trace({entities: entities}, 'doLookup');

    _initRedisClient(options, function(err){
        if(err){
            cb(err);
            return;
        }

        async.each(entities, function (entityObj, next) {
            if (entityObj.isIPv4) {
                _lookupIp(entityObj, options, function (err, result) {
                    if (err) {
                        next(err);
                    } else {
                        lookupResults.push(result);
                        next(null);
                    }
                });
            } else {
                next(null);
            }
        }, function (err) {
            Logger.trace({lookupResults: lookupResults}, 'Lookup Results');
            cb(err, lookupResults);
        });
    });
}

/**
 * Initializes the redis client if it has not already been initialized.  In addition, if the connection options
 * have been changed by the user, the client is recreated to reflect the new connection options.  Finally, this method
 * selects the correct database as specified by the integration options.
 *
 * @param integrationOptions
 * @param cb
 * @private
 */
function _initRedisClient(integrationOptions, cb) {
    if (typeof clientOptions === 'undefined') {
        clientOptions = {
            host: integrationOptions.host,
            port: integrationOptions.port,
            database: integrationOptions.database
        };
    }

    let newOptions = {
        host: integrationOptions.host,
        port: integrationOptions.port,
        database: integrationOptions.database
    };

    if (typeof client === 'undefined' || _optionsHaveChanged(clientOptions, newOptions)) {
        clientOptions = newOptions;
        _closeRedisClient(client, function(){
            client = redis.createClient(clientOptions);
            client.select(integrationOptions.database, function(err){
                if(err){
                    Logger.error({err:err}, 'Error Changing Database');
                }
                Logger.info({con:clientOptions}, 'Created Redis Client');
                cb(null);
            });
        });
    }else{
        cb(null);
    }
}

function _closeRedisClient(myClient, cb){
    if(typeof myClient !== 'undefined'){
        Logger.info("Closing Existing Redis Client");
        client.quit();
        client.on('end', cb);
    }else{
        cb(null);
    }
}

/**
 * Compares two javascript object literals and returns true if they are the same, false if not.  Is used
 * to determine if a user has changed Redis connection options since the last lookup.
 *
 * @param options1
 * @param options2
 * @returns {boolean}
 * @private
 */
function _optionsHaveChanged(options1, options2) {
    return !_.isEqual(options1, options2);
}

function _lookupIp(entityObj, options, cb) {
    _doRedisLookup(entityObj.value, function (err, result) {
        if (err) {
            Logger.error({err: err}, 'Error running sql statement');
            cb(err);
            return;
        } else {
            if (result) {
                // In our example we are storing valid JSON as the Redis key's value.  As a result, we need
                // to parse it pack into a javascript object literal.
                let resultAsJson = _parseRedisResult(result);

                cb(null, {
                    // Required: This is the entity object passed into the integration doLookup method
                    entity: entityObj,
                    // Required: An object containing everything you want passed to the template
                    data: {
                        // Required: These are the tags that are displayed in your template
                        summary: [resultAsJson.hostname],
                        // Data that you want to pass back to the notification window details block
                        details: resultAsJson
                    }
                });
            } else {
                // There was no data for this entity so we return `null` data which will cause the integration
                // cache to cache this lookup as a miss.
                cb(null, {entity: entityObj, data: null});
            }
        }
    });
}

/**
 * This function implements the Redis lookup logic you would like to use to retrieve data from your Redis instance.
 * In the provided example we are getting the key that matches the entity's value.
 *
 * @param entityObj
 * @param cb
 * @private
 */
function _doRedisLookup(entityValue, cb){
    client.get(entityValue, cb);
}

/**
 * Accepts the raw output from the redis lookup command implemented in
 * `_doRedisLookup()`.  Should do any processing required on this data (e.g., convert
 * a JSON string literal into a Javascript Object literal).
 *
 * @param redisResult
 * @private
 */
function _parseRedisResult(redisResult){
    return JSON.parse(redisResult);
}

/**
 * This method is called anytime a user tries to update options for this integration via the integration
 * page.  This method should return errors if the options do not validate.
 * @param options
 */
function validateOptions(userOptions, cb) {
    Logger.debug({userOptions:userOptions}, 'Validating User Options');

    let errors = [];

    if (typeof userOptions.host.value !== 'string' ||
        (typeof userOptions.host.value === 'string' && userOptions.host.value.length === 0)) {
        errors.push({
            key: 'host',
            message: 'You must provide a host value'
        })
    }

    if (typeof userOptions.port.value !== 'string' ||
        (typeof userOptions.port.value === 'string' && userOptions.port.value.length === 0)) {
        errors.push({
            key: 'port',
            message: 'You must provide the port Redis is running on'
        })
    }

    if (typeof userOptions.database.value !== 'string' ||
        (typeof userOptions.database.value === 'string' && userOptions.database.value.length === 0)) {
        errors.push({
            key: 'database',
            message: 'You must provide the Redis database you are connecting to'
        })
    }

    cb(null, errors);
}

module.exports = {
    doLookup: doLookup,
    startup: startup,
    validateOptions: validateOptions
};