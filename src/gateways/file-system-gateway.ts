// Imports
import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import * as path from 'path';
import { IGateway } from './gateway';

export class FileSystemGateway implements IGateway {

    public async append(fileName: string, offset: number, buffer: Buffer): Promise<void> {
        const directory: string = path.dirname(fileName);

        await this.ensureDirectoryExist(directory);

        await this.appendFile(fileName, offset, buffer);
    }

    public computeHash(fileName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const hash = crypto.createHash('md5');
            const stream = fs.createReadStream(fileName);

            stream.on('data', function (data) {
                hash.update(data, 'utf8');
            })

            stream.on('end', function () {
                const result: string = hash.digest('hex');
                resolve(result);
            });
        });
    }

    private async appendFile(fileName: string, offset: number, buffer: Buffer): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const fileStream = fs.createWriteStream(fileName, {
                flags: 'a',
                start: offset
            });

            fileStream.write(buffer, () => {
                fileStream.close();

                resolve();
            });
        });
    }

    private async ensureDirectoryExist(directory: string): Promise<void> {
        return fs.ensureDir(directory);
    }
}