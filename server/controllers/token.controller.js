import APIError, { handleError } from "../helpers/APIError";
import User from "../models/user.model";
import httpStatus from "http-status";
import config from "../config/env";

/**
 * save token so the user start receiving notifications on that device
 */
const saveTokenToUser = async ({ userId, token }) => {
	let user = await User.findOne({ userId });
	if (!user) {
		user = new User({
			userId,
			pushTokens: []
		});
	}
	user.pushTokens = [...user.pushTokens.filter(t => t !== token), token];
	await user.save();
};

/**
 * remove token so the user stops receiving notifications on that device
 */
const removeTokenFromUser = async ({ userId, token }) => {
	let user = await User.findOne({ userId });
	if (!user) {
		throw new Error("User not found");
	}
	user.pushTokens = user.pushTokens.filter(t => t !== token);
	await user.save();
};

export default { saveTokenToUser, removeTokenFromUser };
