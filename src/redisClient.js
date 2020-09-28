const redis = require('redis');

const getRedisClient = function () {
  console.log('hello', process.env.REDISCLOUD_URL);
  if (process.env.REDISCLOUD_URL) {
    return redis.createClient(process.env.REDISCLOUD_URL, {
      no_ready_check: true,
    });
  }
  return redis.createClient({
    url: 'redis://127.0.0.1:6379',
    db: 2,
  });
};

module.exports = { getRedisClient };
