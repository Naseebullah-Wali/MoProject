import { Sequelize } from 'sequelize-typescript';
import User from '../models/user';
import Region from '../models/Region';
const sequelize: Sequelize = new Sequelize({
    database: 'postgres', 
    dialect: 'postgres', 
    username: 'postgres.gjvaefbztfnhmegomgwo', 
    password: 'Sa&ge@55@!90kH$', 
    host: 'aws-0-eu-central-1.pooler.supabase.com', 
    port: 6543,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, 
        },
    },
    logging: false, 
});


sequelize.addModels([User,Region]);


sequelize.sync()
    .then(() => {
        console.log("Database is synced");
    })
    .catch((error) => {
        console.error("Error syncing database:", error);
    });

export default sequelize;
