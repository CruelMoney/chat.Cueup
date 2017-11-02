require('dotenv').config();

export default {
  env: process.env.NODE_ENV || 'development',
  MONGOOSE_DEBUG: true,
  db: process.env.MONGO_URL || 'mongodb://localhost/dev',
  port: process.env.PORT || 4040,
  auth_domain: process.env.AUTH_DOMAIN || '',
  cueup_api_domain: 'https://staging.api.cueup.io'
};
