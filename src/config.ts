import path from 'path';
import { config as testConfig } from './__tests__/config';
import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root('.env'),
	sample: root('.env.example'),
});

const ENV = process.env;
const prodConfig = {
	PORT: ENV.PORT ?? 4000,
	MONGO_URI: ENV.MONGO_URI ?? '',
	TEST: process.env.JEST_WORKER_ID,
};
const config = ENV.JEST_WORKER_ID !== undefined ? testConfig : prodConfig;
export { config };
