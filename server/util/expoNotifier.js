import Expo from "expo-server-sdk";

export const sendNotifications = async ({ title, message, data, tokens }) => {
	return Promise.all(
		tokens.map(async token => {
			if (!Expo.isExpoPushToken(token)) {
				console.error(`Push token ${token} is not a valid Expo push token`);
				return;
			}
			const expo = new Expo();

			const expoMessage = {
				to: token,
				body: message,
				title: title || "New Message 📫",
				badge: 1,
				color: "#00d1ff",
				icon: "https://cueup.io/favicon-32x32.png",
				data
			};

			try {
				await expo.sendPushNotificationsAsync([expoMessage]);
			} catch (error) {
				console.error(error);
			}
		})
	);
};
