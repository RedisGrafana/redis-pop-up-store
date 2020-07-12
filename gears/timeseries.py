# Add Time-Series
def tsAdd(x):
    xlen = execute('XLEN', x['key'])
    execute('TS.ADD', 'ts:len:'+x['key'], '*', xlen)
    execute('TS.ADD', 'ts:enqueue:' + x['key'], '*', x['value'])


# Stream Reader for any Queue
gb = GearsBuilder('StreamReader')
gb.countby(lambda x: x['key']).map(tsAdd)
gb.register(prefix='queue:*', duration=5000, batch=10000, trimStream=False)
