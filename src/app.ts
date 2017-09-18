// Imports
import * as express from 'express';
import * as yargs from 'yargs';

// Import Repositories

// Imports middleware
import * as bodyParser from 'body-parser';

// Imports routes

const argv = yargs.argv;
const app = express();

// Configures body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/roles', requireUser, RolesRouter.index);

app.listen(argv.port || 3000, () => {
    console.log(`listening on port ${argv.port || 3000}`);
});
