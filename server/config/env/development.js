require("dotenv").config();

export default {
	env: process.env.NODE_ENV || "development",
	MONGOOSE_DEBUG: true,
	db: process.env.MONGO_URL || "mongodb://localhost/dev",
	agenda_db: process.env.AGENDA_MONGO || "mongodb://127.0.0.1/cueup-agenda",
	port: process.env.PORT || 4000,
	auth_domain: process.env.AUTH_DOMAIN || "",
	cueup_api_domain:
		process.env.CUEUP_API_DOMAIN || "https://staging.api.cueup.io"
};
