import APIError from '../helpers/APIError';
import Message from '../models/message.model';
import httpStatus from 'http-status';
import config from '../config/env';


function handleError(e){
  return {
    status: e.status || httpStatus.INTERNAL_SERVER_ERROR,
    error: e.message,
    stack: config.env === 'development' ? e.stack : {}
  }
}

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
    })
    .catch(e => {
      cb(handleError(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true)))
    })
}

/**
 * Get message of a specific receiver.
 */
function listChat(room, socket) {
  Message.find({ to: room })
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
      to: room, 
      from: {$ne: senderId}
    },
    { $set: { read: true } },
    {"multi": true}
  )
    .then( _ => {
      socket.to(room).emit('messages read')})
    .catch(e => {});
}

export default { sendMessage, listChat, readMessages };
