export default {
  env: 'test',
  db: 'mongodb://localhost/test',
  port: 4044,
  auth_domain: process.env.AUTH_DOMAIN || '',
};
