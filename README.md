# Pop-up store demo using RedisTimeSeries, RedisGears and Grafana Redis Datasource

<div id="badges" align="center">

[![Grafana 7](https://img.shields.io/badge/Grafana-7-blue)](https://www.grafana.com)
[![RedisTimeSeries](https://img.shields.io/badge/RedisTimeSeries-inspired-yellowgreen)](https://oss.redislabs.com/redistimeseries/)
[![RedisGears](https://img.shields.io/badge/RedisGears-powered-orange)](https://oss.redislabs.com/redisgears/)
[![Grafana-Redis-Datasource](https://img.shields.io/badge/GrafanaRedisDatasource-integrated-yellow)](https://github.com/RedisTimeSeries/grafana-redis-datasource)

</div>

## Description

The Pop-up store demo is using [Redis Streams](https://redis.io/topics/streams-intro), [RedisTimeSeries](https://oss.redislabs.com/redistimeseries/), [RedisGears](https://oss.redislabs.com/redisgears/) and Grafana with [Grafana Redis Datasource](https://github.com/RedisTimeSeries/grafana-redis-datasource) to visualize sale progress.

![Pop-up](https://github.com/mikhailredis/redis-pop-up-store/blob/master/images/pop-up.gif)

## What is displayed on Grafana dashboard

- `Product Available` - the value of `product` key
- `Customers Ordering` - length of `queue:customers`
- `Orders Processing` - length of `queue:orders`
- `Orders Completed` - length of `queue:complete`
- `Customers Overflow` - the difference between customer submitted orders and orders completed
- `Customers Ordering` - change of `queue:customers` length
- `Orders In Queue` - change of `queue:orders` length
- `Completed Flow` - how many orders processed

## Requirements

- [Docker](https://docker.com) to start Redis and Grafana.
- [Node.js](https://nodejs.org) to run simulation script.

## Start Redis with RedisTimeSeries and RedisGears modules installed and Grafana

For detailed instructions please take a look at [redismod - a Docker image with select Redis Labs modules](https://hub.docker.com/r/redislabs/redismod).

```
npm start:docker
```

## RedisGears scripts

- Visualize queues using RedisTimeSeries

```
# Add Time-Series
def tsAdd(x):
    xlen = execute('XLEN', x['key'])
    execute('TS.ADD', 'ts:len:'+x['key'], '*', xlen)
    execute('TS.ADD', 'ts:enqueue:' + x['key'], '*', x['value'])


# Stream Reader for any Queue
gb = GearsBuilder('StreamReader')
gb.countby(lambda x: x['key']).map(tsAdd)
gb.register(prefix='queue:*', duration=5000, batch=10000, trimStream=False)
```

- Complete orders using `queue:complete` stream

```
# Complete order
def complete(x):
    execute('XADD', 'queue:complete', '*', 'order', x['id'],
            'customer', x['value']['customer'])
    execute('XDEL', 'queue:customers', x['value']['customer'])
    execute('DECR', 'product')


# Stream Reader for Orders queue
gb = GearsBuilder('StreamReader')
gb.map(complete)
gb.register(prefix='queue:orders', batch=3, trimStream=True)
```

### Register [StreamReaders](https://oss.redislabs.com/redisgears/readers.html#streamreader)

Install Readers to add Time-Series and complete orders

```
npm register:gears
```

## Install [ioredis](https://github.com/luin/ioredis) module and run simulation

Script `pop-up-store.js` will add customers to stream `queue:customers` and their orders to `queue:orders`.

```
npm start:simulation
```

## Redis-cli

To start `redis-cli` and look at the keys please run

```
npm redis-cli
```
