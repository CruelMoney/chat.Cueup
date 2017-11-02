import APIError, {handleError} from '../helpers/APIError';
import Message from '../models/message.model';
import httpStatus from 'http-status';
import config from '../config/env';


/**
 * Create new message
 * @returns {Message}
 */
function sendMessage(msg, room, socket, cb) {
  const message = new Message(msg);

  return message.save()
    .then(savedMessage => {
      socket.to(room).emit('new message', savedMessage);
      cb(savedMessage)
      return savedMessage;
    })
    .catch(e => {
      cb(handleError(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true)))
    })
}

/**
 * Get message of a specific room.
 */
function listChat(room, socket) {
  Message.find({ room: room })
    .then(messages => {
      socket.emit('initialize chat', messages)})
    .catch(e => {});
}

/**
 * Indicates that the receiver has read his messages.
 */
function readMessages(senderId, room, socket) {
  Message.update(
    { 
      room: room, 
      from: {$ne: senderId}
    },
    { $set: { read: true } },
    {"multi": true}
  )
    .then( _ => {
      socket.to(room).emit('messages read')})
    .catch(e => {});
}

/**
 * Get chats status. Each key represents a room.
 * @returns {Object}
 */
function getUserChatStatus(userId, socket, cb){
  Message.find({to: userId})
    .then(messages => {
      const status = messages.reduce((acc, msg) =>{
            const read = msg.read ? 1 : 0;
            return {
              ...acc,
              [msg.room] :{
                read: acc[msg.room] ? (acc[msg.room].read + read) : read,
                total: acc[msg.room] ? (acc[msg.room].total + 1) : 1,
              }
            }
          }, {})
      cb(status)
    })
    .catch(e => {
      cb(handleError(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true)))
    })
}

export default { sendMessage, listChat, readMessages, getUserChatStatus };
