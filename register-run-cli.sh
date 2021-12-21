# Install StreamReader for Time-Series
cat gears/timeseries.py | redis-cli -h redis -x RG.PYEXECUTE

# Install StreamReader for Orders
cat gears/orders.py | redis-cli -h redis -x RG.PYEXECUTE

# Run Simulation
echo "Starting Customers & Orders simulation"
npm run simulation redis