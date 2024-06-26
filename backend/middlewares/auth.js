const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");

async function user_authentication(req, res, next) {
  const auth_header = req.headers["authorization"];
  if (!auth_header)
    return res.status(402).json({ message: "auth header is missing" });
  const token = auth_header.split(" ")[1];
  if (!token) return res.status(402).json({ message: "auth token is missing" });
  try {
    const payload = jwt.verify(token, jwt_secret);
    req.user_id = payload.user_id;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "authentication failed" });
  }
}

module.exports = user_authentication;
