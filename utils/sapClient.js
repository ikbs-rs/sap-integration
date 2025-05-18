import axios from 'axios';
import dotenv from 'dotenv';

export const fetchSapSessionAndToken = async (username, password) => {
  // const sapUrl = `http://emd-s4h.ems.local:8001/sap/bc/zhr_pa2001?sap-client=100`;
  const sapUrl = `${process.env.SAP_WS}/zhr_pa2001?sap-client=${process.env.SAP_CLIENT}`;
  const sapUsername = username;
  const sapPassword = password;

// console.log("Dosao u SAP client")
  const initial = await axios.get(sapUrl, {
    auth: { username: sapUsername, password: sapPassword },
    // verify: false,
    withCredentials: true
  });
// console.log("Prosao initial ")

  const setCookieHeader = initial.headers['set-cookie'];
  const sessionCookie = setCookieHeader.find(cookie => cookie.includes('SAP_SESSIONID'));

  // console.log("Ponovo prozivam sa SAP_SESSIONID ", sessionCookie)
  const csrf = await axios.get(sapUrl, {
    headers: {
      'X-CSRF-Token': 'Fetch',
      'Cookie': sessionCookie
    },
    withCredentials: true
  });

  return {
    csrfToken: csrf.headers['x-csrf-token'],
    sessionCookie
  };
};
