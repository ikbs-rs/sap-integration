import { createClient } from 'redis';

const client = createClient();
client.connect().catch(console.error);

export default client;
