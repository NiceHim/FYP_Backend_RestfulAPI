import { createClient, RedisClientType } from 'redis';

export default class RedisManager {
  private static instance: RedisManager;
  private redisClient: RedisClientType;

  private constructor(client: any) {
    this.redisClient = client;
  }

  public static async getInstance(): Promise<RedisManager> {
    if (!RedisManager.instance) {
        const client = await RedisManager.createRedisClient();
        RedisManager.instance = new RedisManager(client);
    }
    return RedisManager.instance;
  }

  private static async createRedisClient() {
    try {
      const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
      const client = createClient({
          url: redisUrl
      }).on('error', (err) => console.error("Redis Client Error", err))
      await client.connect();
      return client;
    } catch (error) {
        console.error("Error creating Redis client:", error);
        throw error;
    }
  }

  public getClient() {
    return this.redisClient;
  }

  public static async setCacheData(key: string, value: any, expiration: number) {
    await this.instance.getClient().set(key, JSON.stringify(value), { EX: expiration });
  }

  public static async getCachedData(key: string) {
    const cachedData = await this.instance.getClient().get(key);
    try {
        if (cachedData != null) {
            const data = JSON.parse(cachedData);
            await this.instance.getClient().expire(key, 60 * 5);
            return data;
        }
    } catch (error) {
        console.log("Redis cache retrieval failed:", error);
    }
    return null;
  }

  public static async deleteCachedData(key: string) {
    await this.instance.getClient().del(key);
  }
}