import client from '../db/redisClient.js';

const TTL_SECONDS = 3600; // 1h ili koliko SAP token traje

async function getToken(jwtUser) {
  const data = await client.hGetAll(`sapToken:${jwtUser}`);
  if (!data || !data.sapToken || await isBlacklisted(data.sapToken)) return null;
  return data;
}

async function setToken(jwtUser, sapUser, sapToken, expiresAt) {
  await client.hSet(`sapToken:${jwtUser}`, {
    sapUser,
    sapToken,
    expiresAt
  });
  const ttl = Math.floor((new Date(expiresAt) - new Date()) / 1000);
  await client.expire(`sapToken:${jwtUser}`, ttl);
}

async function blacklistToken(token, durationSeconds = TTL_SECONDS) {
  await client.set(`blacklist:${token}`, '1', { EX: durationSeconds });
}

async function isBlacklisted(token) {
  return await client.exists(`blacklist:${token}`) === 1;
}

export { getToken, setToken, blacklistToken, isBlacklisted };
