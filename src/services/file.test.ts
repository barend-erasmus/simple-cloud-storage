import { expect } from 'chai';
import 'mocha';

import { FileRepository } from './../repositories/memory/file';
import { FileService } from './file';

import { MemoryGateway } from './../gateways/memory-gateway';

import { File } from './../entities/file';

describe('FileService', () => {

    let fileService: FileService = null;

    describe('startSession', () => {
        it('should return session id', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            expect(sessionId).to.be.not.null;
        });

        it('should return session id given file with open session already exist', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository);

            let sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            const buffer = Buffer.from('Hello World', 'utf8');
            await fileService.append(sessionId, buffer);

            sessionId = await fileService.startSession('hello-world.txt', 11, 'profileId');

            expect(sessionId).to.be.not.null;
        });

        it('should throw exception given file with closed session already exist', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            const buffer = Buffer.from('Hello World', 'utf8');
            await fileService.append(sessionId, buffer);
            await fileService.endSession(sessionId);

            try {
                await fileService.startSession('hello-world.txt', 11, 'profileId');
                throw new Error('Expected Error');
            } catch (error) {
                expect(error.message).to.be.eq('File already exist');
            }
        });
    });

    describe('append', () => {
        it('should return', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            const buffer = Buffer.from('Hello World', 'utf8');
            await fileService.append(sessionId, buffer);
        });

        it('should throw exception given buffer exceeds FileSize', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            try {
                const buffer = Buffer.from('Hello World, Hello World', 'utf8');
                await fileService.append(sessionId, buffer);

                throw new Error('Expected Error');
            } catch (error) {
                expect(error.message).to.be.eq('FileSize Exceeded');
            }
        });

        it('should throw exception given fileSize exceeded', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            const buffer = Buffer.from('Hello World', 'utf8');
            await fileService.append(sessionId, buffer);

            try {
                await fileService.append(sessionId, buffer);

                throw new Error('Expected Error');
            } catch (error) {
                expect(error.message).to.be.eq('FileSize Exceeded');
            }
        });

        it('should throw exception given invalid sessionId', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository);

            try {
                const buffer = Buffer.from('Hello World', 'utf8');
                await fileService.append('sessionId', buffer);

                throw new Error('Expected Error');
            } catch (error) {
                expect(error.message).to.be.eq('Invalid SessionId');
            }
        });
    });
});
