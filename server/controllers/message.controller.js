import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Message from '../models/message.model';

/**
 * Load message and append to req.
 */
function load(req, res, next, id) {
  Message.get(id)
    .then((message) => {
      req.message = message; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get message
 * @returns {Message}
 */
function get(req, res) {
  return res.json(req.message);
}

/**
 * Create new message
 * @property {string} req.body.content - The content of the message.
 * @property {string} req.body.to - ID of the receiver.
 * @returns {Message}
 */
function create(req, res, next) {
  const message = new Message(req.body);

  message.from = req.user.sub;

  message.save()
    .then(savedMessage => res.json(savedMessage))
    .catch(e => next(e));
}

/**
 * Update existing message
 * @property {string} req.body.content - The content of the message.
 * @returns {Message}
 */
function update(req, res, next) {
  const message = req.message;
  message.content = req.body.content || message.content;
  message.save()
    .then(savedMessage => res.json(savedMessage))
    .catch(e => next(new APIError(e.message, httpStatus.CONFLICT, true)));
}

/**
 * Get message of a specific receiver.
 * @returns {Message[]}
 * @property {string} req.body.to - The id of the receiver.
 */
function list(req, res, next) {
  const {receiverId} = req.params;

  Message.find({ to: receiverId })
    .then(messages => res.json(messages))
    .catch(e => next(e));
}

/**
 * Delete message.
 * @returns {Message}
 */
function remove(req, res, next) {
  const message = req.message;
  message.remove()
    .then(deletedMessage => res.json(deletedMessage))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
