import express from "express";
import notificationCtr from "../../controllers/notification.controller";
import auth from "basic-auth";
import tokenController from "../../controllers/token.controller";
const router = express.Router();

router.get("/status", (req, res, next) => {
	res.json({ status: "UP" });
});

// router.use("/api", (req, res, next) => {
// 	const user = auth(req);
// 	console.log({ user });
// 	if (!user) {
// 		return res.status(401).send("Unauthorized user");
// 	}
// });

router.post("/api/notifications/new", async (req, res, next) => {
	const { gigId, userId, message, title } = req.body;
	try {
		await notificationCtr.newNotification({ userId, gigId, message, title });
		res.status(200).send("Ok");
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

router.post("/api/tokens", async (req, res, next) => {
	const { userId, token } = req.body;
	try {
		await tokenController.saveTokenToUser({ userId, token });
		res.status(200).send("Ok");
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

router.delete("/api/tokens", async (req, res, next) => {
	const { userId, token } = req.body;
	try {
		await tokenController.removeTokenFromUser({ userId, token });
		res.status(200).send("Ok");
	} catch (error) {
		console.error(error);
		res.status(500).send(error.message);
	}
});

export default router;
