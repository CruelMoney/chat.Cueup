import express from 'express';
import validate from 'express-validation';
import Joi from 'joi';
import messageCtr from '../../controllers/message.controller';

const router = express.Router(); // eslint-disable-line new-cap
const paramValidation = {
  createMessage: {
    body: {
      content: Joi.string().required(),
      to: Joi.string().required(),
    }
  },
  updateMessage: {
    params: {
      messageId: Joi.string().required()
    },
    body: {
      content: Joi.string().required(),      
    },
  }
};

router.route('/')
  /** POST /api/messages - Create new message */
  .post(validate(paramValidation.createMessage), messageCtr.create);

router.route('/:messageId')
  /** GET /api/messages/:messageId - Get message */
  .get(messageCtr.get)

  /** PUT /api/messages/:messageId - Update message */
  .put(validate(paramValidation.updateMessage), messageCtr.update)

  /** DELETE /api/messages/:messageId - Delete message */
  .delete(messageCtr.remove);

router.route('/to/:receiverId')
  /** GET /api/messages - Get list of messages */
  .get(messageCtr.list);

/** Load message when API with messageId route parameter is hit */
router.param('messageId', messageCtr.load);

export default router;
