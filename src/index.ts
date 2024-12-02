import http from 'http';

import { app } from './server/app';
import { config } from './config';
import { connectDatabase, disconnectDatabase } from './database';

let server: http.Server;
export const startServer = async () => {
	await connectDatabase();

	server = http.createServer(app.callback());

	server.listen(config.PORT, () => {
		// eslint-disable-next-line
		//console.log(`Server running on port:${config.PORT}`);
	});
};

export const stopServer = async (): Promise<void> => {
	if (server) {
		await new Promise<void>(() => server.close());
	}
	await disconnectDatabase();
};
if (require.main === module) {
	startServer();
}
