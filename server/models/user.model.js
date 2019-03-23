import mongoose from "mongoose";
import httpStatus from "http-status";
import APIError from "../helpers/APIError";

/**
 * Message Schema
 */
const UserSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		unique: true
	},
	pushTokens: {
		type: [String],
		required: true,
		default: []
	}
});

// /**
//  * - pre-post-save hooks
//  * - validations
//  * - virtuals
//  */
// UserSchema.pre("save", async function() {

// });

/**
 * Statics
 */
UserSchema.statics = {};

/**
 * @typedef User
 */
const User = mongoose.model("User", UserSchema);
export default User;
