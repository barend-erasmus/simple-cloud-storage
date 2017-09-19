// Import repositories
import { BaseRepository } from './repositories/sequelize/base';
import { FileRepository } from './repositories/sequelize/file';

const baseRepository: BaseRepository = new BaseRepository('developersworkspace.co.za', 'simple-cloud-storage', '1wF1cJ0m5j4ldBPdVuWs');

baseRepository.sync().then(async () => {
    baseRepository.close();
}).catch((err: Error) => {
    console.error(err);
    baseRepository.close();
});
