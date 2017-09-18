export class FileSystemGateway {

    public append(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const fileStream = fs.createWriteStream('./test.txt', {
                flags: 'a',
                start: offset
            });
        
            fileStream.write(req.body, () => {
                offset += req.body.length;
                fileStream.close();
        
                res.send('Hello World!');
            });
        });  
    }

}