// Import 
import * as Stream from 'stream';

export interface IGateway {
    append(filename: string, offset: number, buffer: Buffer): Promise<void>;
    computeHash(fileName: string): Promise<string>;
    delete(fileName: string): Promise<void>;
    getStream(fileName: string): Promise<Stream>;
}
