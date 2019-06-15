import APIError, { handleError } from "../helpers/APIError";
import Notification from "../models/notification.model";
import Message from "../models/message.model";
import httpStatus from "http-status";
import config from "../config/env";
import * as emailNotifier from "../util/emailNotifier";
import * as expoNotifier from "../util/expoNotifier";
import User from "../models/user.model";

/**
 * Get notifications for user.
 */
function listNotifications(userId, socket) {
	Promise.all([
		Message.find({ to: userId, read: false }),
		Notification.find({ userId: userId })
	])
		.then(([messages, notifications]) => {
			socket.emit("initialize notifications", [
				...Object.values(
					// Reduce messages to one notification per room
					messages.reduce((acc, msg) => {
						if (msg.read) return acc;
						return {
							...acc,
							[msg.to]: msg.toNotification()
						};
					}, {})
				),

				// include standard notifications
				...notifications
			]);
		})
		.catch(e => {});
}

/**
 * Emit new notifications.
 */
const newMessageNotification = async (message, originalMessage, socket) => {
	if (!message || !message._id) return;

	// try sending push notification
	try {
		const receiver = await User.findOne({
			userId: originalMessage.to,
			pushTokens: { $exists: true, $not: { $size: 0 } }
		});

		if (receiver) {
			expoNotifier.sendNotifications({
				message: message.content,
				data: { gigId: originalMessage.room, navigateTo: "chat" },
				tokens: receiver.pushTokens
			});
		}
	} catch (error) {
		console.error(error);
	}

	// Give the receiver 5 secs to read the message first before sending email
	setTimeout(() => {
		Message.findById(message._id)
			.exec()
			.then(savedMsg => {
				if (savedMsg && !savedMsg.read && !!originalMessage.eventId) {
					emailNotifier.sendNotification({
						eventId: originalMessage.eventId,
						receiverId: savedMsg.to,
						senderId: savedMsg.from
					});
					socket
						.to(savedMsg.to)
						.emit("new notification", savedMsg.toNotification());
				}
			});
	}, 5000);
};

/**
 * New notification
 */
const newNotification = async ({ userId, gigId, title, message }) => {
	if (!userId) throw new Error("No userID");

	const receiver = await User.findOne({
		userId,
		pushTokens: { $exists: true, $not: { $size: 0 } }
	});

	if (receiver) {
		expoNotifier.sendNotifications({
			title,
			message,
			data: { gigId },
			tokens: receiver.pushTokens
		});
		console.error("Event notification send");
	}
};

export default {
	listNotifications,
	newMessageNotification,
	newNotification
};
