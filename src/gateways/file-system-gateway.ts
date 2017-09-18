// Imports
import * as fs from 'fs';
import { IGateway } from './gateway';

export class FileSystemGateway implements IGateway {

    public append(filename: string, offset: number, buffer: Buffer): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const fileStream = fs.createWriteStream(filename, {
                flags: 'a',
                start: offset
            });
        
            fileStream.write(buffer, () => {
                fileStream.close();
        
                resolve();
            });
        });  
    }
}