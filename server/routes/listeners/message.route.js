import messageCtr from '../../controllers/message.controller';
import notificaitonCtr from '../../controllers/notification.controller';

export default socket => {
  const showPersonalInformation = socket.handshake.query.showPersonalInformation;
  const room = socket.handshake.query.room;
  if (!room) return;
  console.log('listening messages');

  const roomId = 'room/' + room;

  socket.join(roomId, () => {
    // sending to all clients in room except sender
    socket.to(roomId).emit('user online');
    messageCtr.listChat({ room, socket, showPersonalInformation });
  });
  socket.on('disconnect', () => {
    socket.to(roomId).emit('user offline');
  });

  socket.on('send message', (msg, cb) => {
    socket.to(roomId).emit('stopped typing');
    messageCtr.sendMessage({ msg, roomId, socket, cb, showPersonalInformation }).then(savedMsg => {
      if (!savedMsg) return;
      notificaitonCtr.newMessageNotification(savedMsg, msg, socket);
    });
  });

  socket.on('started typing', () => {
    socket.to(roomId).emit('started typing');
  });
  socket.on('stopped typing', () => {
    socket.to(roomId).emit('stopped typing');
  });

  socket.on('messages read', senderId => {
    messageCtr.readMessages(senderId, room, roomId, socket);
  });
};
