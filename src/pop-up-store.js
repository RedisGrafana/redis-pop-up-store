/**
 * A robust, performance-focused and full-featured Redis client for Node.js.
 *
 * @see https://github.com/luin/ioredis
 */
const Redis = require("ioredis");

/**
 * You can also specify connection options as a redis:// URL or rediss:// URL when using TLS encryption:
 */
const redis = new Redis("redis://localhost:6379");

/**
 * There are 10000 products on sale today
 *
 * @see https://redis.io/commands/set
 */
const product = 10000;
redis.set("product", product);

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
   * Waiting to customer to submit order
   *
   * @see https://redis.io/commands/xadd
   */
  setTimeout(function () {
    redis.xadd("queue:orders", "*", "id", genId(), "customer", result);
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
   * Waiting for next
   */
  setTimeout(newCustomer, Math.floor(Math.random() * 100));
}

/**
 * Sale started
 */
newCustomer();
