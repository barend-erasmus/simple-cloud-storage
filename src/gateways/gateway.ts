export interface IGateway {
    append(filename: string, offset: number, buffer: Buffer): Promise<void>;
}