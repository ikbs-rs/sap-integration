import axios from "axios";
import {
  getToken,
  setToken,
  blacklistToken,
} from "../middleware/redisTokenStore.js";

async function loginToSAP(jwtUser, username, password) {
  const sapUrl = `${process.env.SAP_WS}/zhr_pa2001?sap-client=${process.env.SAP_CLIENT}`;
  const sapUsername = username;
  const sapPassword = password;
  // const res = await axios.post('http://emd-s4h.ems.local:8001/sap/bc/zhr_pa2001?sap-client=100', {
  const res = await axios.get(sapUrl, {
    auth: { username: sapUsername, password: sapPassword },
    withCredentials: true,
  });
  //   {
  //     username,
  //     password,
  //   }
  // );
  console.log("5555555555555555555555555555555555555", res.data);
  const { sapUser, sapToken, expiresAt } = res.data;
  await setToken(jwtUser, sapUser, sapToken, expiresAt);
  return sapToken;
}

async function ensureValidToken(jwtUser, username, password) {

  let tokenData = await getToken(jwtUser);

  if (!tokenData) {
    return await loginToSAP(jwtUser, username, password);
  }

  const expiresSoon =
    new Date(tokenData.expiresAt) - new Date() < 2 * 60 * 1000;
  if (expiresSoon) {
    await blacklistToken(tokenData.sapToken);
    return await loginToSAP(jwtUser, username, password);
  }

  return tokenData.sapToken;
}

async function callSapService(jwtUser, username, password) {
  let sapToken = await ensureValidToken(jwtUser, username, password);
  console.log(
    "99999999999999999999999999999999999999999999999999999",
    sapToken
  );
  const sapUrl = `${process.env.SAP_WS}/zhr_pa2001?sap-client=${process.env.SAP_CLIENT}`;
  try {
    // const res = await axios.get("http://sap.local/sap/zrest_service", {
    const res = await axios.get(sapUrl, {
      headers: { "X-SAP-Token": sapToken },
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      await blacklistToken(sapToken);
      sapToken = await loginToSAP(jwtUser, username, password); // fallback
      // const res = await axios.get("http://sap.local/sap/zrest_service", {
      const res = await axios.get(sapUrl, {
        headers: { "X-SAP-Token": sapToken },
      });
      return res.data;
    }
    throw err;
  }
}

export { loginToSAP, ensureValidToken, callSapService };
