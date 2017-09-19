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
            fileService = new FileService(new MemoryGateway(), fileRepository, null);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            expect(sessionId).to.be.not.null;
        });

        it('should return existing session id given file already exist', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository, null);

            const sessionId1: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            const buffer = Buffer.from('Hello World', 'utf8');
            await fileService.appendSession(sessionId1, buffer);

            const sessionId2: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            expect(sessionId2).to.be.not.null;
            expect(sessionId2).to.be.eq(sessionId1);
        });
    });

    describe('appendSession', () => {
        it('should return', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository, null);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            const buffer = Buffer.from('Hello World', 'utf8');
            await fileService.appendSession(sessionId, buffer);
        });

        it('should throw exception given buffer exceeds FileSize', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository, null);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            try {
                const buffer = Buffer.from('Hello World, Hello World', 'utf8');
                await fileService.appendSession(sessionId, buffer);

                throw new Error('Expected Error');
            } catch (error) {
                expect(error.message).to.be.eq('FileSize Exceeded');
            }
        });

        it('should throw exception given fileSize exceeded', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository, null);

            const sessionId: string = await fileService.startSession('hello-world.txt', 11, 'profileId');

            const buffer = Buffer.from('Hello World', 'utf8');
            await fileService.appendSession(sessionId, buffer);

            try {
                await fileService.appendSession(sessionId, buffer);

                throw new Error('Expected Error');
            } catch (error) {
                expect(error.message).to.be.eq('FileSize Exceeded');
            }
        });

        it('should throw exception given invalid sessionId', async () => {
            const fileRepository: FileRepository = new FileRepository();
            fileService = new FileService(new MemoryGateway(), fileRepository, null);

            try {
                const buffer = Buffer.from('Hello World', 'utf8');
                await fileService.appendSession('sessionId', buffer);

                throw new Error('Expected Error');
            } catch (error) {
                expect(error.message).to.be.eq('Invalid SessionId');
            }
        });
    });
});
