import { createClient } from 'redis';
import dotenv from 'dotenv'

dotenv.config()

const client = createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

export default client;
