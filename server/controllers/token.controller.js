import APIError, { handleError } from "../helpers/APIError";
import User from "../models/user.model";
import httpStatus from "http-status";
import config from "../config/env";

/**
 * Get notifications for user.
 */
const saveTokenToUser = async ({ userId, token, socket }) => {
	let user = await User.findOne({ userId });
	if (!user) {
		user = new User({
			userId,
			pushTokens: []
		});
	}
	user.pushTokens = [...user.pushTokens.filter(t => t !== token), token];
	await user.save();
	socket.emit("Token saved", user);
};

export default { saveTokenToUser };
