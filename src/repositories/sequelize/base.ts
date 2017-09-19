// Imports
import * as Sequelize from 'sequelize';

export class BaseRepository {
    protected static sequelize: Sequelize.Sequelize = null;
    protected static models: {
        File: Sequelize.Model<{}, {}>,
    } = null;

    private static defineModels(): void {
        const File = BaseRepository.sequelize.define('file', {
            checksum: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            createdTimestamp: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            fileName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            fileSize: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            offset: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            profileId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            sessionId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });

        this.models = {
            File,
        };
    }

    constructor(private host: string, private username: string, private password: string) {

        if (!BaseRepository.sequelize) {
            BaseRepository.sequelize = new Sequelize('simple-cloud-storage', username, password, {
                dialect: 'postgres',
                host,
                logging: false,
                pool: {
                    idle: 10000,
                    max: 5,
                    min: 0,
                },
            });

            BaseRepository.defineModels();
        }
    }

    public sync(): Promise<void> {
        return new Promise((resolve, reject) => {
            BaseRepository.sequelize.sync({ force: true }).then(() => {
                resolve();
            });
        });
    }

    public close(): void {
        BaseRepository.sequelize.close();
    }
}
