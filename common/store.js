const Redis = require("ioredis");
import {Store} from "koa-session2";
const redisConfig = require('../config/config.js').redis;
class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis(redisConfig);
    }
    async get(sid) {
        let session = await this.redis.get(`xiaochengxuId:${sid}`);
        if(session){
            session = JSON.parse(session);
            this.redis.expireat(`xiaochengxuId:${sid}`, parseInt(Date.now() / 1000) + redisConfig.ttl).catch(e => {
                console.error(e);
            });
        } else {
            session = {};
        }
        return session;
    }
    async set(session, opts) {
        if(!opts.sid) {
            opts.sid = this.getID(24);
        }
        await this.redis.set(`xiaochengxuId:${opts.sid}`, JSON.stringify(session), 'EX', redisConfig.ttl);
        return opts.sid;
    }
    async destroy(sid) {
        return await this.redis.del(`xiaochengxuId:${sid}`);
    }
}
export default new RedisStore();