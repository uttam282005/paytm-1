require('dotenv').config();

module.exports = {
  mongo_url: process.env.MONGO_URL,
  PORT: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET
};
