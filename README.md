# Pop-up store demo using RedisTimeSeries, RedisGears and Redis plugins for Grafana</h1>

![Pop-up](https://github.com/RedisTimeSeries/redis-pop-up-store/blob/master/images/pop-up-dashboard.png)

[![Grafana 8](https://img.shields.io/badge/Grafana-8-orange)](https://www.grafana.com)
[![Redis Data Source](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Data%20Source&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-datasource)](https://grafana.com/grafana/plugins/redis-datasource) [![Redis Application](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Application&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-app)](https://grafana.com/grafana/plugins/redis-app)

The Pop-up store is using [Redis Streams](https://redis.io/topics/streams-intro), [RedisTimeSeries](https://oss.redis.com/redistimeseries/), [RedisGears](https://oss.redis.com/redisgears/) and [Redis plugins](https://redisgrafana.github.io) to visualize data pipeline in Grafana.

## How it works

![Diagram](https://github.com/RedisTimeSeries/redis-pop-up-store/blob/master/images/pop-up.png)

- Node.js script adds random data to Customers and Orders streams
- RedisGears is using `StreamReader` to watch all `queue:` keys and adding Time-Series samples

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

- Another RedisGears script completes orders
  - adding data to `queue:complete` stream
  - deleting client's ordering
  - decreasing product amount
  - trimming Orders queue

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

- Grafana query streams and Time-Series keys every 5 seconds to display samples using Grafana plugins.

## Demo

Demo is available on [demo.volkovlabs.io](https://demo.volkovlabs.io):

- [Redis Overview dashboard](https://demo.volkovlabs.io/d/TgibHBv7z/redis-overview?orgId=1&refresh=1h)
- [Pop-up Store dashboard](https://demo.volkovlabs.io/d/0LC0Sm7Ml/pop-up-store?orgId=1)

## Requirements

- [Docker](https://docker.com) to start Redis and Grafana.
- [Node.js](https://nodejs.org) to run simulation script.

## Start Redis with RedisTimeSeries, RedisGears modules installed and Grafana

```
npm run start
```

## Register RedisGears functions

Install Readers to add Time-Series and complete orders

```
npm run register
```

## Install [ioredis](https://github.com/luin/ioredis) module and start simulation

Script `pop-up-store.js` will add customers to stream `queue:customers` and their orders to the `orders` keys.

```
npm run simulation
```

## Grafana Dashboards

Open Grafana Dashboard using browser http://localhost:3000

## Redis-cli

To start `redis-cli` and look at the keys please run

```
npm run redis-cli
```
