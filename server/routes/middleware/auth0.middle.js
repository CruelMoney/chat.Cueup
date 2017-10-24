import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import config from '../../config/env';

export default jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    jwksUri: `${config.auth_domain}/.well-known/jwks.json`
  }),
  algorithms: [ 'RS256'],
});