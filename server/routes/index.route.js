import IO from "socket.io";
import messageRoutes from "./listeners/message.route";
import notificationRoutes from "./listeners/notification.route";
import tokenRoutes from "./listeners/token.route";
//import auth from './middleware/auth0.middle'

export default server => {
	const io = IO(server);

	// no auth because people can access event without being logged in
	// auth(io);

	io.on("connection", socket => {
		console.log("Trying connections");
		tokenRoutes(socket);
		messageRoutes(socket);
		notificationRoutes(socket);
	});
};
