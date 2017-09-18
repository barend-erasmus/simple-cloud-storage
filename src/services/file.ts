// Imports
import { IGateway } from './../gateways/gateway';

export class FileService {

    constructor(private gateway: IGateway) {

    }

    public startSession(fileName: string, fileSize: number): Promise<string> {
        return null;
    }

    public append(sessionId: string, buffer: Buffer): Promise<void> {
        return null;
    }

    public endSession(sessionId: string): Promise<void> {
        return null;
    }
}