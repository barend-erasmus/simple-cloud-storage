// Imports
import * as express from 'express';
import * as yargs from 'yargs';

// Import repositories

// Imports middleware
import * as bodyParser from 'body-parser';

// Imports routes
import { FilesRouter } from './routes/file';

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(bodyParser.raw({
    inflate: true,
    limit: '100kb',
    type: 'application/octet-stream',
}));

app.post('/files/start', FilesRouter.start);
app.post('/files/append', FilesRouter.append);
app.post('/files/finish', FilesRouter.finish);
app.get('/files/list', FilesRouter.list);
app.get('/files/download', FilesRouter.download);

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
