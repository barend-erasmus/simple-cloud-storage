// Imports
import * as Stream from 'stream';
import { IGateway } from './gateway';

export class MemoryGateway implements IGateway {

    public async append(fileName: string, offset: number, buffer: Buffer): Promise<void> {
        return;
    }

    public async delete(fileName: string): Promise<void> {
        return;
    }

    public async computeHash(fileName: string): Promise<string> {
        return 'abc';
    }

    public async getStream(fileName: string): Promise<Stream> {
        return null;
    }
}
