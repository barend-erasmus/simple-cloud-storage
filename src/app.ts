// Imports
import * as path from 'path';
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
    limit: '50mb',
    type: 'application/octet-stream',
}));

app.post('/files/start', FilesRouter.start);
app.post('/files/append', FilesRouter.append);
app.post('/files/finish', FilesRouter.finish);
app.get('/files/list', FilesRouter.list);
app.get('/files/download', FilesRouter.download);
app.get('/files/deleteProfile', FilesRouter.deleteProfile);
app.get('/files/deleteFile', FilesRouter.deleteFile);

app.use('/api/docs', express.static(path.join(__dirname, './../apidoc')));
app.use('/api/coverage', express.static(path.join(__dirname, './../coverage/lcov-report')));

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
