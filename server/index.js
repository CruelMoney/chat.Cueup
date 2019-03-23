import mongoose from "mongoose";
import util from "util";
import "babel-polyfill";
import config from "./config/env";
import app from "./config/express";
import socketio from "./routes/index.route";

const debug = require("debug")("node-starter:index");

// make bluebird default Promise
Promise = require("bluebird"); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
mongoose.connect(config.db);
mongoose.connection.on("error", () => {
	throw new Error(`unable to connect to database: ${config.db}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
	mongoose.set("debug", (collectionName, method, query, doc) => {
		debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
	});
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
	// listen on port config.port
	const server = app.listen(config.port, () => {
		console.log(`🚀 server started on port ${config.port} (${config.env})`);
		console.log("DB running on: " + config.db);
	});

	socketio(server);
}

export default app;
