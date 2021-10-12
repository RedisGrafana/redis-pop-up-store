# Install StreamReader for Time-Series
cat gears/timeseries.py | docker exec -i redis redis-cli -x RG.PYEXECUTE

# Install StreamReader for Orders
cat gears/orders.py | docker exec -i redis redis-cli -x RG.PYEXECUTE