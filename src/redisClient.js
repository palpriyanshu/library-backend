const redis = require('redis');

const getRedisClient = function () {
  if (process.env.REDISCLOUD_URL) {
    return redis.createClient(process.env.REDISCLOUD_URL, {
      no_ready_check: true,
    });
  }
  return redis.createClient({
    db: 2,
  });
};

module.exports = { getRedisClient };
