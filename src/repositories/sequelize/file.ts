// Imports
import { IFileRepository } from './../file';
import { BaseRepository } from './base';

// Imports models
import { File } from './../../entities/file';

export class FileRepository extends BaseRepository implements IFileRepository {

    constructor(host: string, username: string, password: string) {
        super(host, username, password);
    }

    public async create(file: File): Promise<boolean> {

        await BaseRepository.models.File.create({
            checksum: file.checksum,
            createdTimestamp: file.createdTimestamp,
            fileName: file.fileName,
            fileSize: file.fileSize,
            offset: file.offset,
            profileId: file.profileId,
            sessionId: file.sessionId,
        });

        return true;
    }

    public async findBySessionId(sessionId: string): Promise<File> {

        const file: any = await BaseRepository.models.File.find({
            where: {
                sessionId,
            },
        });

        if (!file) {
            return null;
        }

        return new File(file.fileName, file.fileSize, file.offset, file.sessionId, file.profileId, file.createdTimestamp, file.checksum);
    }

    public async findByFileName(fileName: string, profileId: string): Promise<File> {
        const file: any = await BaseRepository.models.File.find({
            where: {
                fileName,
                profileId,
            },
        });

        if (!file) {
            return null;
        }

        return new File(file.fileName, file.fileSize, file.offset, file.sessionId, file.profileId, file.createdTimestamp, file.checksum);
    }

    public async findByChecksum(checksum: string, profileId: string): Promise<File> {
        const file: any = await BaseRepository.models.File.find({
            where: {
                checksum,
                profileId,
            },
        });

        if (!file) {
            return null;
        }

        return new File(file.fileName, file.fileSize, file.offset, file.sessionId, file.profileId, file.createdTimestamp, file.checksum);
    }

    public async update(file: File): Promise<boolean> {
        const existingFile: any = await BaseRepository.models.File.find({
            where: {
                sessionId: file.sessionId,
            },
        });

        if (!file) {
            return null;
        }

        existingFile.offset = file.offset;
        existingFile.checksum = file.checksum;
        existingFile.createdTimestamp = file.createdTimestamp;

        await existingFile.save();
    }

    public async list(profileId: string): Promise<File[]> {
        const files: any[] = await BaseRepository.models.File.findAll({
            where: {
                createdTimestamp: {
                    $ne: null
                },
                profileId,
            },
        });

        return files.map((x) => new File(x.fileName, x.fileSize, x.offset, x.sessionId, x.profileId, x.createdTimestamp, x.checksum));
    }

    public async deleteFile(fileName: string, profileId: string): Promise<boolean> {
        await BaseRepository.models.File.destroy({
            where: {
                fileName,
                profileId,
            },
        });

        return true;
    }

    public async deleteProfile(profileId: string): Promise<boolean> {
        await BaseRepository.models.File.destroy({
            where: {
                profileId,
            },
        });

        return true;
    }
}
