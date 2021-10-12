# Complete order
def complete(x):
    execute('XADD', 'queue:complete', '*', 'order', x['id'],
            'customer', x['value']['customer'])
    execute('XDEL', 'queue:customers', x['value']['customer'])
    execute('DECR', 'product')

    product = execute('GET', 'product')
    if int(product) < 1000:
        execute('SET', 'product', 10000)


# Stream Reader for Orders queue
gb = GearsBuilder('StreamReader')
gb.map(complete)
gb.register(prefix='orders', batch=3, trimStream=True)
