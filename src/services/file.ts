// Imports
import * as crypto from 'crypto';
import * as Stream from 'stream';
import { IGateway } from './../gateways/gateway';
import { IFileRepository } from './../repositories/file';

// Imports models
import { File } from './../entities/file';

export class FileService {

    constructor(private gateway: IGateway, private fileRepository: IFileRepository, private basePath: string) {

    }

    public async startSession(fileName: string, fileSize: number, profileId: string): Promise<string> {

        const existingFile: File = await this.fileRepository.findByFileName(fileName, profileId);

        if (existingFile) {

            existingFile.checksum = null;
            existingFile.createdTimestamp = null;
            existingFile.fileSize = fileSize;
            existingFile.offset = 0;

            await this.fileRepository.update(existingFile);

            await this.gateway.delete(this.buildFileNamePath(existingFile));

            return existingFile.sessionId;
        }

        const sessionId: string = crypto.randomBytes(32).toString('hex');

        const file: File = new File(fileName, fileSize, 0, sessionId, profileId, null, null);

        await this.fileRepository.create(file);

        return sessionId;
    }

    public async appendSession(sessionId: string, buffer: Buffer): Promise<void> {

        const file: File = await this.fileRepository.findBySessionId(sessionId);

        if (!file) {
            throw new Error('Invalid SessionId');
        }

        if (file.offset >= file.fileSize) {
            throw new Error('FileSize Exceeded');
        }

        if (file.offset + buffer.length > file.fileSize) {
            throw new Error('FileSize Exceeded');
        }

        await this.gateway.append(this.buildFileNamePath(file), file.offset, buffer);

        file.offset += buffer.length;

        await this.fileRepository.update(file);
    }

    public async endSession(sessionId: string): Promise<void> {
        const file: File = await this.fileRepository.findBySessionId(sessionId);

        if (!file) {
            throw new Error('Invalid SessionId');
        }

        file.checksum = await this.gateway.computeHash(this.buildFileNamePath(file));
        file.createdTimestamp = new Date();

        await this.fileRepository.update(file);
    }

    public async list(profileId: string): Promise<File[]> {
        return this.fileRepository.list(profileId);
    }

    public async download(fileName: string, profileId: string): Promise<Stream> {

        const file: File = await this.fileRepository.findByFileName(fileName, profileId);

        if (!file) {
            throw new Error('File does not exist');
        }

        return this.gateway.getStream(this.buildFileNamePath(file));
    }

    private buildFileNamePath(file: File): string {
        return `${this.basePath}/${file.profileId}/${file.fileName}`;
    }
}
