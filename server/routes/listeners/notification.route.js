import notificationCtr from '../../controllers/notification.controller';
import messageCtr from '../../controllers/message.controller';

export default socket => {
  const { userId, pushToken } = socket.handshake.query;
  if (!userId || !!pushToken) return;

  const userRoomId = "user/" + userId;

  socket.join(userRoomId, () => {
    notificationCtr.listNotifications(userId, socket);
  });

  socket.on('get chat status', fn => {
    messageCtr.getUserChatStatus(userId, socket, fn);
  });
};
