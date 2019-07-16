export default {
  env: process.env.NODE_ENV || 'production',
  db: process.env.MONGO_URL || 'mongodb://localhost/prod',
  port: process.env.PORT || 4040,
  agenda_db: process.env.AGENDA_MONGO || 'mongodb://127.0.0.1/cueup-agenda',
  auth_domain: process.env.AUTH_DOMAIN || '',
  cueup_api_domain: process.env.CUEUP_API_DOMAIN || 'https://api.cueup.io',
};
