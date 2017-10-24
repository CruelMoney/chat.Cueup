export default {
  env: process.env.NODE_ENV || 'development',
  MONGOOSE_DEBUG: true,
  db: process.env.DB || 'mongodb://localhost/dev',
  port: process.env.PORT || 4040,
  auth_domain: process.env.AUTH_DOMAIN || '',
};
