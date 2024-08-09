import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const { graphqlRouter } = await import('./controller/index.js');

const SERVER_PORT = 3000;

class RepositoryScanner {
	constructor() { }

	run() {
		const app = express();

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		app.use(graphqlRouter);

		app.listen(SERVER_PORT, () => {
			console.log(`Server started at http://localhost:${SERVER_PORT}`);
		});
	}
}

const appplication = new RepositoryScanner();

appplication.run();
