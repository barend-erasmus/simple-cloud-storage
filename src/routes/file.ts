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

    /**
     * @api {post} /files/start Start File Upload
     * @apiName FilesStart
     * @apiGroup Files
     *
     * @apiParam {String} fileName Name of File
     * @apiParam {String} fileSize Size of File
     * @apiParam {String} profileId Profile Id
     * 
     */
    public static async start(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            const sessionId: string = await fileService.startSession(req.body.fileName, req.body.fileSize, req.body.profileId);

            res.json(sessionId);
        } catch (err) {
            res.status(400).json(err.message);
        }
    }

    /**
     * @api {post} /files/append Append File
     * @apiName FilesAppend
     * @apiGroup Files
     *
     * @apiHeaderExample {json} Header-Example:
     *      {
     *          "Authorization": "<session-id>"
     *      }
     * 
     */
    public static async append(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            await fileService.appendSession(req.get('authorization'), req.body);

            res.json(true);
        } catch (err) {
            res.status(400).json(err.message);
        }
    }

    /**
     * @api {post} /files/finish Finish File Upload
     * @apiName FilesFinish
     * @apiGroup Files
     *
     * @apiHeaderExample {json} Header-Example:
     *      {
     *          "Authorization": "<session-id>"
     *      }
     * 
     */
    public static async finish(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            await fileService.endSession(req.get('authorization'));

            res.json(true);
        } catch (err) {
            res.status(400).json(err.message);
        }
    }

    /**
     * @api {get} /files/list List Files
     * @apiName FilesList
     * @apiGroup Files
     *
     * @apiParam {String} profileId Profile Id
     * 
     */
    public static async list(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            const files: File[] = await fileService.list(req.query.profileId);

            res.json(files);
        } catch (err) {
            res.status(400).json(err.message);
        }
    }

    /**
     * @api {get} /files/download Download File
     * @apiName FilesDownload
     * @apiGroup Files
     *
     * @apiParam {String} fileName Name of File
     * @apiParam {String} profileId Profile Id
     * 
     */
    public static async download(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            const stream: Stream = await fileService.download(req.query.fileName, req.query.profileId);

            res.attachment(path.basename(req.query.fileName));
            stream.pipe(res);
        } catch (err) {
            res.status(400).json(err.message);
        }
    }

    /**
     * @api {get} /files/deleteProfile Delete Profile
     * @apiName FilesDeleteProfile
     * @apiGroup Files
     *
     * @apiParam {String} profileId Profile Id
     * 
     */
    public static async deleteProfile(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            await fileService.deleteProfile(req.query.profileId);

            res.json(true);
        } catch (err) {
            res.status(400).json(err.message);
        }
    }

    /**
     * @api {get} /files/deletFile Delete File
     * @apiName FilesDeleteFile
     * @apiGroup Files
     *
     * @apiParam {String} fileName Name of File
     * @apiParam {String} profileId Profile Id
     * 
     */
    public static async deleteFile(req: express.Request, res: express.Response) {

        try {
            const fileService: FileService = FilesRouter.getFileService();

            await fileService.deleteFile(req.query.fileName, req.query.profileId);

            res.json(true);
        } catch (err) {
            res.status(400).json(err.message);
        }
    }

    private static getFileService(): FileService {
        return new FileService(new FileSystemGateway(), new FileRepository('developersworkspace.co.za', 'simple-cloud-storage', '1wF1cJ0m5j4ldBPdVuWs'), argv.prod ? '/var/simple-cloud-storage' : './storage');
    }
}
