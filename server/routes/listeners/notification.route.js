import notificationCtr from '../../controllers/notification.controller';
import messageCtr from '../../controllers/message.controller';


export default (socket) => {
    
  const userId = socket.handshake.query.userId;
  if(!!!userId) return
    
  socket.join(userId, () => {  
    notificationCtr.listNotifications(userId, socket)
  });

  socket.on('get chat status', fn => {
    messageCtr.getUserChatStatus(userId, socket, fn)
  }); 

}
