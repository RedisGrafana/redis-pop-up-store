/**
 * A robust, performance-focused and full-featured Redis client for Node.js.
 *
 * @see https://github.com/luin/ioredis
 */
const Redis = require("ioredis");

/**
 * You can also specify connection options as a redis:// URL or rediss:// URL when using TLS encryption:
 */
const redis = new Redis(getRedisURI());

/**
 * There are 10000 products on sale today
 *
 * @see https://redis.io/commands/set
 */
const product = 10000;
redis.set("product", product);

/**
 * Get Redis host from first argument (optional)
 * argv is: [ '/usr/local/bin/node', '/app/src/pop-up-store.js', '...' ]
 */
function getRedisURI() {
  if (process.argv.length > 2) {
    return "redis://"+process.argv[2]+":6379";
  } else {
    return "redis://localhost:6379";
  }
}

/**
 * Generate Id
 */
function genId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Every customer wants to buy 1 product
 */
function submitOrder(err, result) {
  if (err) {
    console.error(err);
    return;
  }

  /**
   * Waiting for customer to submit order
   *
   * @see https://redis.io/commands/xadd
   */
  setTimeout(function () {
    redis.xadd("orders", "*", "id", genId(), "customer", result);
  }, Math.floor(Math.random() * 1000));
}

/**
 * New customer
 */
function newCustomer() {
  /**
   * Registering new customer
   */
  redis.xadd("queue:customers", "*", "id", genId(), submitOrder);

  /**
   * Waiting for the next
   */
  setTimeout(newCustomer, Math.floor(Math.random() * 1000));
}

/**
 * Sale started
 */
console.log("Now running simulation...")
newCustomer();
