import IO from 'socket.io';
import messageRoutes from './listeners/message.route';
import auth from './middleware/auth0.middle'

export default (server) =>{
  
    const io = IO(server);

   // auth(io);
    messageRoutes(io);
    
}