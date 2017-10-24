export default {
  env: process.env.NODE_ENV || 'production',
  db: process.env.DB || 'mongodb://localhost/prod',
  port: process.env.PORT || 4040,
  auth_domain: process.env.AUTH_DOMAIN || '',
};
