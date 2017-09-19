// Imports interfaces
import { IFileRepository } from './../file';

// Imports models
import { File } from './../../entities/file';

export class FileRepository implements IFileRepository {

    private files: File[] = [];

    public async create(file: File): Promise<boolean> {
        this.files.push(file);

        return true;
    }

    public async findBySessionId(sessionId: string): Promise<File> {
        return this.files.find((x) => x.sessionId === sessionId);
    }

    public async findByFileName(fileName: string, profileId: string): Promise<File> {
        return this.files.find((x) => x.fileName === fileName && x.profileId === profileId);
    }

    public async findByChecksum(checksum: string, profileId: string): Promise<File> {
        return null;
    }

    public async update(file: File): Promise<boolean> {
        const existingFile: File = this.files.find((x) => x.sessionId === file.sessionId);

        existingFile.checksum = file.checksum;
        existingFile.createdTimestamp = file.createdTimestamp;

        return true;
    }

    public async list(profileId: string): Promise<File[]> {
        return this.files.filter((x) => x.profileId === profileId && x.createdTimestamp !== null);
    }
}
