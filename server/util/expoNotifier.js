import Expo from "expo-server-sdk";

export const sendNotification = async ({ message, gigId, tokens }) => {
	return Promise.all(
		tokens.map(async token => {
			if (!Expo.isExpoPushToken(token)) {
				console.error(`Push token ${token} is not a valid Expo push token`);
				return;
			}
			const expo = new Expo();

			const message = {
				to: token,
				body: message,
				title: "New Message",
				subtitle: null,
				badge: 1,
				data: {
					gigId
				}
			};

			try {
				await expo.sendPushNotificationsAsync([message]);
			} catch (error) {
				console.error(error);
			}
		})
	);
};
