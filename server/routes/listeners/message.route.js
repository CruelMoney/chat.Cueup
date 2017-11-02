import messageCtr from '../../controllers/message.controller';
import notificaitonCtr from '../../controllers/notification.controller';


export default (socket) => {
    
    const room = socket.handshake.query.room;
    if(!!!room) return
      
    socket.join(room, () => {
      // sending to all clients in room except sender      
      socket.to(room).emit('user online');
      messageCtr.listChat(room, socket)
    });
    socket.on('disconnect', ()=>{
      socket.to(room).emit('user offline');
    })
  
    socket.on('send message', (msg, fn)=>{
      socket.to(room).emit('stopped typing');
      messageCtr.sendMessage(msg, room, socket, fn)
        .then(savedMsg=>{
          notificaitonCtr.newMessageNotification(savedMsg, msg, socket);      
        });
    });
  
    socket.on('started typing', ()=>{
      socket.to(room).emit('started typing');
    });
    socket.on('stopped typing', ()=>{
      socket.to(room).emit('stopped typing');
    });
    
    socket.on('messages read', (senderId)=>{
      messageCtr.readMessages(senderId, room, socket);
    });
  
}