# Polarity Redis Server Example Integration

This integration is a framework to allow you to create customized integrations for connecting to and executing queries against a Redis Server.

## Overview

The Redis Example integration provides a working implementation of an integration that can connect to a Redis database.  This integration is setup to receive `IPv4` addresses.  If you would like to modify the type of data sent to the integration please modify the `entityTypes` parameter in the `config/config.js` file.

This integration does a simple `GET` lookup into Redis and assume that the value of the entity (in this case an IP) is the `key` in Redis.  You can provide more complex lookup logic by reimplmenting the `doRedisLookup()` method.

This integration also assumes that the `value` stored in Redis is stored as JSON string (i.e., a string that can be parsed back into a JSON object).  This behavior can be modified in the `_parseRedisResult` method. 

Further information on how to use the Node Redis client can be found at [https://github.com/NodeRedis/node_redis](https://github.com/NodeRedis/node_redis).

The integration currently outputs the data returned into a table.

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).

## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see:

https://polarity.io/
