// Imports
import * as crypto from 'crypto';
import { IGateway } from './../gateways/gateway';
import { IFileRepository } from './../repositories/file';

// Imports Models
import { File } from './../entities/file';

export class FileService {

    constructor(private gateway: IGateway, private fileRepository: IFileRepository) {

    }

    public async startSession(fileName: string, fileSize: number, profileId: string): Promise<string> {

        const sessionId: string = crypto.randomBytes(64).toString('hex');

        const file: File = new File(fileName, fileSize, 0, sessionId, profileId, new Date(), null);

        await this.fileRepository.create(file);

        return sessionId;
    }

    public async append(sessionId: string, buffer: Buffer): Promise<void> {

        const file: File = await this.fileRepository.findBySessionId(sessionId);

        await this.gateway.append(`./storage/${file.profileId}/${file.fileName}`, file.offset, buffer);

        file.offset += buffer.length;

        await this.fileRepository.update(file);
    }

    public async endSession(sessionId: string): Promise<void> {
        const file: File = await this.fileRepository.findBySessionId(sessionId);

        file.checksum = await this.gateway.computeHash(`./storage/${file.profileId}/${file.fileName}`);

        await this.fileRepository.update(file);
    }
}