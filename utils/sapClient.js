import axios from 'axios';

export const fetchSapSessionAndToken = async () => {
  const sapUrl = 'http://emd-s4h.ems.local:8001/sap/bc/zhr_pa2001?sap-client=100';
  const sapUsername = 'dmarjanov';
  const sapPassword = 'p-----';

  const initial = await axios.get(sapUrl, {
    auth: { username: sapUsername, password: sapPassword },
    withCredentials: true
  });

  const setCookieHeader = initial.headers['set-cookie'];
  const sessionCookie = setCookieHeader.find(cookie => cookie.includes('SAP_SESSIONID'));

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
