import path from 'path';

import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root('.env'),
	sample: root('.env.example'),
});

const ENV = process.env;

const config = {
	PORT: ENV.PORT ?? 4000,
	MONGO_URI: 'mongodb://localhost/test-woovi-challenge-backend' ?? '',
	TEST: process.env.JEST_WORKER_ID,
};

export { config };
