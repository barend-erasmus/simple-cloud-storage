// Imports Models
import { File } from './../../entities/file';

export class FileRepository {

    private static files: File[] = [];


    public async create(file: File): Promise<boolean> {
        FileRepository.files.push(file);

        console.log(FileRepository.files);
        
        return true;
    }

    public async findBySessionId(sessionId: string): Promise<File> {
        console.log(FileRepository.files);
        return FileRepository.files.find((x) => x.sessionId === sessionId);
    }

    public async findByFileName(fileName: string, profileId: string): Promise<File> {
        return null;
    }

    public async findByChecksum(checksum: string, profileId: string): Promise<File> {
        return null;
    }

    public async update(file: File): Promise<boolean> {
        const existingFile: File = FileRepository.files.find((x) => x.sessionId === file.sessionId);

        existingFile.checksum = file.checksum;

        console.log(FileRepository.files);
        return true;
    }
}