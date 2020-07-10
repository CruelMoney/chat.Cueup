import httpStatus from 'http-status';
import APIError, { handleError } from '../helpers/APIError';
import Message from '../models/message.model';
import config from '../config/env';
import * as nlp from '../services/nlp';
import { enrichMessage } from '../services/metadataScraper';

/**
 * Create new message
 * @returns {Message}
 */
async function sendMessage({ msg, roomId, socket, cb, showPersonalInformation }) {
  try {
    const message = new Message(msg);
    const content = message.content;
    try {
      message.containsEmail = nlp.containsEmail(content);
      message.containsNumber = nlp.containsNumber(content);
      message.containsUrl = nlp.containsURL(content);
    } catch (error) {
      console.log(error);
      throw new Error('Error analysing message');
    }

    if (
      msg.declineOnContactInfo &&
      (message.containsEmail || message.containsNumber || message.containsUrl)
    ) {
      return cb(
        handleError(
          new APIError('Message contains contact information', httpStatus.FORBIDDEN, true)
        )
      );
    }

    console.log('URL: ', message.containsUrl);

    if (message.containsUrl) {
      await enrichMessage(message);
    }
    console.log({ message });

    let savedMessage = await message.save();
    console.log({ savedMessage });

    if (!showPersonalInformation) {
      try {
        savedMessage.content = nlp.replaceAll(savedMessage.content);
      } catch (error) {
        console.log(error);
      }
    }
    socket.to(roomId).emit('new message', savedMessage);
    cb(savedMessage);

    return savedMessage;
  } catch (e) {
    return cb(handleError(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true)));
  }
}

/**
 * Get message of a specific room.
 */
function listChat({ room, socket, showPersonalInformation }) {
  Message.find({ room })
    .then(messages => {
      let msgs = messages;
      if (!showPersonalInformation) {
        msgs = messages.map(msg => {
          try {
            msg.content = nlp.replaceAll(msg.content);
          } catch (error) {
            console.log(error);
          }
          return msg;
        });
      }

      socket.emit('initialize chat', msgs);
    })
    .catch(e => { });
}

/**
 * Indicates that the receiver has read his messages.
 */
function readMessages(senderId, room, roomId, socket) {
  Message.update(
    {
      room,
      from: { $ne: senderId },
    },
    { $set: { read: true } },
    { multi: true }
  )
    .then(_ => {
      socket.to(roomId).emit('messages read');
    })
    .catch(e => { });
}

/**
 * Get chats status. Each key represents a room.
 * @returns {Object}
 */
function getUserChatStatus(userId, socket, cb) {
  Message.find({ to: userId })
    .then(messages => {
      const status = messages.reduce((acc, msg) => {
        const read = msg.read ? 1 : 0;
        return {
          ...acc,
          [msg.room]: {
            read: acc[msg.room] ? acc[msg.room].read + read : read,
            total: acc[msg.room] ? acc[msg.room].total + 1 : 1,
          },
        };
      }, {});
      cb(status);
    })
    .catch(e => {
      cb(handleError(new APIError(e.message, httpStatus.INTERNAL_SERVER_ERROR, true)));
    });
}

export default { sendMessage, listChat, readMessages, getUserChatStatus };
