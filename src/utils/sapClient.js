import axios from 'axios';
import dotenv from 'dotenv';

const extractSessionId = (cookieString) => {
  const match = cookieString.match(/SAP_SESSIONID[^=]*=([^;]+)/);
  return match ? match[1] : null;
};

const extractFullSessionCookie = (cookieString) => {
  const match = cookieString.match(/(SAP_SESSIONID[^=]*=[^;]+)/);
  return match ? match[1] : null;
};

export const fetchSapSessionAndToken = async (username, password) => {
  // const sapUrl = `http://emd-s4h.ems.local:8001/sap/bc/zhr_pa2001?sap-client=100`;
  const sapUrl = `${process.env.SAP_WS}/zhr_pa2001?sap-client=${process.env.SAP_CLIENT}`;
  const sapUsername = username;
  const sapPassword = password;

console.log("Dosao u SAP client", sapUrl, sapUsername, sapPassword)
  const initial = await axios.get(sapUrl, {
    auth: { username: sapUsername, password: sapPassword },
    // verify: false,
    withCredentials: true
  });

  const setCookieHeader = initial.headers['set-cookie'];
  const sessionCookie = setCookieHeader.find(cookie => cookie.includes('SAP_SESSIONID'));

  const sessionCookieHeder = await extractFullSessionCookie(sessionCookie)

  console.log(sapUsername, "-------------------------------------------",  sapPassword)

  const csrf = await axios.get(sapUrl, {
    headers: {
      'X_CSRF_Token': 'Fetch',
      'Accept': 'application/json',
      'Cookie': sessionCookieHeder
    },
    withCredentials: true
  });

// const prviKorak = await axios.get('http://emd-s4h.ems.local:8001/ems/hr/pt_seniority', {
//   auth: { username: sapUsername, password: sapPassword },
//   // verify: false,
//   withCredentials: true
// });

// console.log("Dohvatio prviKorak ******", prviKorak.prviKorak)

  const x_csrf_token = csrf.headers['x_csrf_token']
console.log("Dodao dao poziva Delete")
  const prazanWS1 = await axios.delete('http://emd-s4h.ems.local:8001/ems/hr/pt_seniority', {
    headers: {
      'x_csrf_token': x_csrf_token,
      'Content-Type': 'application/json',
      'Cookie': sessionCookieHeder
    },
    withCredentials: true
  });  
console.log("+++++++++++++++++++++++++", prazanWS1.data)
  return {
    csrfToken: csrf.headers['x_csrf_token'],
    sessionCookie: sessionCookieHeder,
    prezanWS: prazanWS1.data
  };
};
