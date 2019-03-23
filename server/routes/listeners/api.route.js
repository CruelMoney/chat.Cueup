import express from "express";
import notificationCtr from "../../controllers/notification.controller";
const router = express.Router();

router.get("/status", (req, res, next) => {
	res.json({ status: "UP" });
});

router.get("/api/notifications/event", async (req, res, next) => {
	const { gigId, userId } = req.query;
	try {
		await notificationCtr.newEventNotification({ userId, gigId });
		res.send(200);
	} catch (error) {
		console.error(error);
		res.send(500, error.message);
	}
});

export default router;
