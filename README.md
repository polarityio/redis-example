# Polarity Redis Server Example Integration

![image](https://cloud.githubusercontent.com/assets/306319/25863866/5be1f68e-34bb-11e7-8074-dcc67c3b2bd7.png)

This integration is a framework to allow you to create customized integrations for connecting to and executing queries against a Redis Server.

## Overview

The Redis Example integration provides a working implementation of an integration that can connect to a Redis database.  This integration is setup to receive `IPv4` addresses.  If you would like to modify the type of data sent to the integration please modify the `entityTypes` parameter in the `config/config.js` file.

This integration does a simple `GET` lookup into Redis and assumes that the value of the entity (in this case an IP) is the `key` in Redis.  You can provide more complex lookup logic by reimplementing the `doRedisLookup()` method.

This integration also assumes that the `value` stored in Redis is stored as a JSON string (i.e., a string that can be parsed back into a JSON object).  This behavior can be modified in the `_parseRedisResult` method. 


| ![image](https://cloud.githubusercontent.com/assets/306319/25863892/70619f4c-34bb-11e7-8a99-b521c1a0c796.png) |
|----|
|*(Example key-value pair in Redis)*|

Further information on how to use the Node Redis client can be found at [https://github.com/NodeRedis/node_redis](https://github.com/NodeRedis/node_redis).

The integration currently outputs the data returned into a key-value table.

## Installation Instructions

Installation instructions for integrations are provided on the [PolarityIO GitHub Page](https://polarityio.github.io/).

## Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see:

https://polarity.io/
