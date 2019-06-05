import path from "path";

const _ = require("lodash");

const env = process.env.NODE_ENV || "development";
const config = require(`./${env}`).default; // eslint-disable-line import/no-dynamic-require

const defaults = {
	root: path.join(__dirname, "..", "..", ".."),
	...config
};

export default defaults;
