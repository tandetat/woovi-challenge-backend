import http from 'http';

import { app } from './server/app';
import { config } from './config';
import { connectDatabase } from './database';

let server: http.Server;
export const startServer = async () => {
	await connectDatabase();

	server = http.createServer(app.callback());

	server.listen(config.PORT, () => {
		// eslint-disable-next-line
		console.log(`Server running on port:${config.PORT}`);
	});
};

export const stopServer = async (): Promise<void> => {
	if (server) {
		await new Promise<void>((resolve) => server.close(() => resolve()));
		console.log('Server stopped.');
	}
};

startServer();
