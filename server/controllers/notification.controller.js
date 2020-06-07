import Notification from '../models/notification.model';
import Message from '../models/message.model';

import { queueNewMessageNotification } from '../util/agendaSetup';

/**
 * Get notifications for user.
 */
function listNotifications(userId, socket) {
  Promise.all([Message.find({ to: userId, read: false }), Notification.find({ userId })])
    .then(([messages, notifications]) => {
      socket.emit('initialize notifications', [
        ...Object.values(
          // Reduce messages to one notification per room
          messages.reduce((acc, msg) => {
            if (msg.read) return acc;
            return {
              ...acc,
              [msg.to]: msg.toNotification(),
            };
          }, {})
        ),

        // include standard notifications
        ...notifications,
      ]);
    })
    .catch(e => { });
}

/**
 * Emit new notifications.
 */
const newMessageNotification = async (message, originalMessage, socket) => {
  if (!message || !message._id) return;

  // try sending push notification
  try {
    await queueNewMessageNotification({
      gigId: originalMessage.room,
      message: message.content,
      senderId: originalMessage.from,
      receiverId: originalMessage.to,
      eventId: originalMessage.eventId,
      messageId: message._id,
    });

    const userRoomId = 'user/' + originalMessage.to;

    socket
      .to(userRoomId)
      .emit("new notification", originalMessage.toNotification());
  } catch (error) {
    console.error(error);
  }
};

export default {
  listNotifications,
  newMessageNotification,
};
