import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import socketioJwt from "socketio-jwt"
import config from '../../config/env';

// export default jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     jwksUri: `${config.auth_domain}/.well-known/jwks.json`
//   }),
//   algorithms: [ 'RS256'],
// });


export default (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.query.token;

    const decoded_token = jwt.decode(token, {complete: true});

    const client = jwksClient({
      cache: true,
      jwksUri: `${config.auth_domain}/.well-known/jwks.json`
    });
  
    const kid = decoded_token.header.kid;
  
    client.getSigningKey(kid, (err, key) => {
      if(err) return

      const cert = key.publicKey || key.rsaPublicKey;
      const options = {
        algorithms: [ 'RS256']
      }

      jwt.verify(token, cert, options, function(err, decoded) {
          // Not doing anything about unverified
          next();
      });
  
    });
  });
}

 