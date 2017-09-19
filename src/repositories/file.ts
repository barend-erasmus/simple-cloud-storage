// Imports Models
import { File } from './../entities/file';

export interface IFileRepository {
    create(file: File): Promise<boolean>;
    findBySessionId(sessionId: string): Promise<File>;
    findByFileName(fileName: string, profileId: string): Promise<File>;
    findByChecksum(checksum: string, profileId: string): Promise<File>;
    update(file: File): Promise<boolean>;
}