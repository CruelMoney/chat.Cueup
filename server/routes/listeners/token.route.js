import tokenCtr from "../../controllers/token.controller";

export default socket => {
	const { userId, expoToken } = socket.handshake.query;

	if (!userId || !expoToken) return;

	socket.join(userId, _ => {
		tokenCtr.saveTokenToUser({
			userId,
			token: expoToken,
			socket
		});
	});
};
