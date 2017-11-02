export default {
  env: process.env.NODE_ENV || 'production',
  db: process.env.MONGO_URL || 'mongodb://localhost/prod',
  port: process.env.PORT || 4040,
  auth_domain: process.env.AUTH_DOMAIN || '',
  cueup_api_domain: 'https://api.cueup.io'
};
