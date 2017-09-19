// Imports
import * as express from 'express';
import { FileSystemGateway } from './../gateways/file-system-gateway';

// Imports repositories
import { FileRepository } from './../repositories/memory/file';

// Imports services
import { FileService } from './../services/file';

// Imports models
import { File } from './../entities/file';

export class FilesRouter {

    public static async start(req: express.Request, res: express.Response) {

        const fileService: FileService = FilesRouter.getFileService();

        const sessionId: string = await fileService.startSession(req.body.fileName, req.body.fileSize, req.body.profileId);

        res.json(sessionId);
    }

    public static async append(req: express.Request, res: express.Response) {

        const fileService: FileService = FilesRouter.getFileService();

        await fileService.appendSession(req.get('authorization'), req.body);

        res.json(true);
    }

    public static async finish(req: express.Request, res: express.Response) {

        const fileService: FileService = FilesRouter.getFileService();

        await fileService.endSession(req.get('authorization'));

        res.json(true);
    }

    public static async list(req: express.Request, res: express.Response) {

        const fileService: FileService = FilesRouter.getFileService();

        const files: File[] = await fileService.list(req.query.profileId);

        res.json(files);
    }

    private static getFileService(): FileService {
        return new FileService(new FileSystemGateway(), new FileRepository());
    }
}
