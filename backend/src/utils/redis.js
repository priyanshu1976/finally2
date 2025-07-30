const { configDotenv } = require("dotenv");
const Redis = require("ioredis");
configDotenv();

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
  maxRetriesPerRequest: null,
  retryDelayOnFailover: 100,
  lazyConnect: true,
};

const redisClient = new Redis(redisConfig);

const createRedisConnection = () => {
  return new Redis(redisConfig);
};

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

module.exports = {
  redisClient,
  createRedisConnection,
};
