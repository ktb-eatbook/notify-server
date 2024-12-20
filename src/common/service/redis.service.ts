import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from 'cache-manager';
import { Inject, Injectable, Logger } from "@nestjs/common";

const logger: Logger = new Logger("RedisService")

@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly redisClient: Cache,
    ){}

    async get(key: string): Promise<string | undefined> {
        try {
            return await this.redisClient.get(key)
        } catch(e) {
            logger.error(`Redis data get is failure\nReason: ${e}`)
            return undefined
        }
    }

    async set(
        key: string, 
        value: string,
        { ttl }: { ttl?: number }
    ): Promise<boolean> {
        try {   
            await this.redisClient.set(key, value, ttl)
            return true
        } catch(e) {
            logger.error(`Redis data set is failure\nReason: ${e}`)
            return false
        }
    }

    async remove(key: string): Promise<boolean> {
        try {    
            await this.redisClient.del(key)
            return true
        } catch(e) {
            logger.error(`Redis data remove is failure\nReason: ${e}`)
            return false
        }
    }
}