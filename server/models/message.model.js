import mongoose from "mongoose";
import httpStatus from "http-status";
import APIError from "../helpers/APIError";

/**
 * Message Schema
 */
const MessageSchema = new mongoose.Schema({
	from: {
		type: String,
		required: true
	},
	to: {
		type: String,
		required: true
	},
	room: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	read: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	containsEmail: {
		type: Boolean,
		default: false
	},
	containsNumber: {
		type: Boolean,
		default: false
	}
});

// /**
//  * - pre-post-save hooks
//  * - validations
//  * - virtuals
//  */
// MessageSchema.pre("save", async function() {

// });

/**
 * Methods
 */
MessageSchema.method({
	toNotification() {
		return {
			content: "You have an unread message 📫",
			read: this.read,
			createdAt: this.createdAt,
			userId: this.to,
			room: this.room
		};
	}
});

/**
 * Statics
 */
MessageSchema.statics = {
	/**
	 * Get Message
	 * @param {ObjectId} id - The objectId of Message.
	 * @returns {Promise<Message, APIError>}
	 */
	get(id) {
		return this.findById(id)
			.exec()
			.then(message => {
				if (message) {
					return message;
				}
				const err = new APIError(
					"No such message exists!",
					httpStatus.NOT_FOUND
				);
				return Promise.reject(err);
			});
	},

	/**
	 * List Messages.
	 * @returns {Promise<Message[]>}
	 */
	list() {
		return this.find().exec();
	},

	/**
	 * List messages in descending order of 'createdAt' timestamp.
	 * @param {number} skip - Number of messages to be skipped.
	 * @param {number} limit - Limit number of messages to be returned.
	 * @returns {Promise<Message[]>}
	 */
	listLazy({ skip = 0, limit = 50 } = {}) {
		return this.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.exec();
	}
};

/**
 * @typedef Message
 */
export default mongoose.model("Message", MessageSchema);
