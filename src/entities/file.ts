export class File {
    constructor(
        public fileName: string,
        public fileSize: number,
        public offset: number,
        public sessionId: string,
        public profileId: string,
        public createdTimestamp: Date,
        public checksum: string,
    ) {

    }
}