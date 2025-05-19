import { Pool } from 'pg';
const pool = new Pool();

async function getToken(jwtUser) {
  const res = await pool.query(
    'SELECT * FROM sap_tokens WHERE jwt_user = $1 AND expires_at > NOW()',
    [jwtUser]
  );
  return res.rows[0] || null;
}

async function setToken(jwtUser, sapUser, sapToken, expiresAt) {
  await pool.query(`
    INSERT INTO sap_tokens (jwt_user, sap_user, sap_token, expires_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (jwt_user) DO UPDATE
    SET sap_user = $2, sap_token = $3, expires_at = $4
  `, [jwtUser, sapUser, sapToken, expiresAt]);
}

export default { getToken, setToken };
