# Install StreamReader to add Queue to Time-Series
cat gears/timeseries.py | docker exec -i redismod redis-cli -x RG.PYEXECUTE

# Install StreamReader to complete orders
cat gears/complete.py | docker exec -i redismod redis-cli -x RG.PYEXECUTE
