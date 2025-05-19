import axios from 'axios';
import { getToken, setToken, blacklistToken } from '../middleware/redisTokenStore.js';

async function loginToSAP(jwtUser, username, password) {
  const res = await axios.post('http://sap.local/sap/zlogin_handler', {
    username,
    password
  });

  const { sapUser, sapToken, expiresAt } = res.data;
  await setToken(jwtUser, sapUser, sapToken, expiresAt);
  return sapToken;
}

async function ensureValidToken(jwtUser, username, password) {
  let tokenData = await getToken(jwtUser);

  if (!tokenData) {
    return await loginToSAP(jwtUser, username, password);
  }

  const expiresSoon = new Date(tokenData.expiresAt) - new Date() < 2 * 60 * 1000;
  if (expiresSoon) {
    await blacklistToken(tokenData.sapToken);
    return await loginToSAP(jwtUser, username, password);
  }

  return tokenData.sapToken;
}

async function callSapService(jwtUser, username, password) {
  let sapToken = await ensureValidToken(jwtUser, username, password);

  try {
    const res = await axios.get('http://sap.local/sap/zrest_service', {
      headers: { 'X-SAP-Token': sapToken }
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      await blacklistToken(sapToken);
      sapToken = await loginToSAP(jwtUser, username, password); // fallback
      const res = await axios.get('http://sap.local/sap/zrest_service', {
        headers: { 'X-SAP-Token': sapToken }
      });
      return res.data;
    }
    throw err;
  }
}

export { loginToSAP, ensureValidToken, callSapService };
