// Imports
import * as express from 'express';
import * as yargs from 'yargs';

// Import Repositories

// Imports middleware
import * as bodyParser from 'body-parser';

// Imports routes
import { FilesRouter } from './routes/file';

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
    inflate: true,
    limit: '100kb',
    type: 'application/octet-stream',
};

app.use(bodyParser.raw(options));

app.post('/files/create', FilesRouter.create);
app.post('/files/append', FilesRouter.append);
app.post('/files/finish', FilesRouter.finish);

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
