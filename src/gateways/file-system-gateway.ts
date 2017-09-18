// Imports
import * as fs from 'fs';

export class FileSystemGateway {

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