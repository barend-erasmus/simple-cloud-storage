// Imports
import * as express from 'express';
import * as path from 'path';
import * as Stream from 'stream';
import * as yargs from 'yargs';
import { FileSystemGateway } from './../gateways/file-system-gateway';

// Imports repositories
import { FileRepository } from './../repositories/sequelize/file';

// Imports services
import { FileService } from './../services/file';

// Imports models
import { File } from './../entities/file';

const argv = yargs.argv;

export class FilesRouter {

    public static async start(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            const sessionId: string = await fileService.startSession(req.body.fileName, req.body.fileSize, req.body.profileId);

            res.json(sessionId);
        } catch (err) {
            res.json(err.message);
        }
    }

    public static async append(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            await fileService.appendSession(req.get('authorization'), req.body);

            res.json(true);
        } catch (err) {
            res.json(err.message);
        }
    }

    public static async finish(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            await fileService.endSession(req.get('authorization'));

            res.json(true);
        } catch (err) {
            res.json(err.message);
        }
    }

    public static async list(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            const files: File[] = await fileService.list(req.query.profileId);

            res.json(files);
        } catch (err) {
            res.json(err.message);
        }
    }

    public static async download(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            const stream: Stream = await fileService.download(req.query.fileName, req.query.profileId);

            res.attachment(path.basename(req.query.fileName));
            stream.pipe(res);
        } catch (err) {
            res.json(err.message);
        }
    }

    private static getFileService(): FileService {
        return new FileService(new FileSystemGateway(), new FileRepository('developersworkspace.co.za', 'simple-cloud-storage', '1wF1cJ0m5j4ldBPdVuWs'), argv.prod? '/var/simple-cloud-storage' : './storage');
    }
}
