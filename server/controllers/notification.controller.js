import APIError, {handleError} from '../helpers/APIError';
import Notification from '../models/notification.model';
import Message from '../models/message.model';
import httpStatus from 'http-status';
import config from '../config/env';
import * as emailNotifier from '../util/emailNotifier'
/**
 * Get notifications for user.
 */
function listNotifications(userId, socket) {
  
  Promise.all([
    Message.find({to: userId, read: false }),
    Notification.find({userId: userId})
  ])
  .then(([messages, notifications]) => {
    socket.emit('initialize notifications', [

      ...Object.values(
        // Reduce messages to one notification per room
        messages.reduce((acc, msg)=>{
        if(msg.read) return acc
        return {
          ...acc,
          [msg.to]: msg.toNotification()
        }
      }, {})), 

      // include standard notifications 
      ...notifications
    ])
  })
  .catch(e => {});      
   
}

/**
 * Emit new notifications.
 */
function newMessageNotification(message, originalMessage, socket) {
  // Give the receiver 5 secs to read the message first
  setTimeout(()=>{
    Message.findById(message._id)
    .exec()
    .then(savedMsg => {
      if(savedMsg && !savedMsg.read && !!originalMessage.eventId){
        emailNotifier.sendNotification({
          eventId: originalMessage.eventId,
          receiverId: savedMsg.to,
          senderId: savedMsg.from
        });
        socket.to(savedMsg.to).emit('new notification', savedMsg.toNotification())
      }
    })
  }, 5000)  
}

export default { listNotifications, newMessageNotification };
