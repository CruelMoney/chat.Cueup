import 'dotenv/config';
import Agenda from 'agenda';
import config from '../config/env';

const connectionOpts = {
  db: {
    address: config.agenda_db,
    options: {
      useNewUrlParser: true,
    },
  },
};

const agenda = new Agenda(connectionOpts);

const queueNewMessageNotification = async ({
  gigId,
  senderId,
  receiverId,
  message,
  eventId,
  messageId,
}) => {
  await agenda.now('NEW_MESSAGE', {
    gigId,
    senderId,
    receiverId,
    message,
    eventId,
    messageId,
  });
};

export default agenda;

export { queueNewMessageNotification };
