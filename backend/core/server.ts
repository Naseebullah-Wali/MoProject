import express from 'express'
import { Server, createServer } from 'http';
import { Sequelize } from 'sequelize';
import rout from '../routers/pagerouter'
const cookieParser = require('cookie-parser');
import {sequelize} from '../dbConfig/dbConfig';
import cors from 'cors';

class App {
    public port: number;
    public host: string;

    private app: express.Application;
    private server: Server;
    private sequelize: Sequelize;

    constructor(port = 900, host = '127.0.0.1') {
        this.port = port;
        this.host = host;
        this.sequelize = sequelize;
        this.app = this.createApp();
        this.server = this.createServer();
    }

    private createApp(): express.Application {
        const app = express();

        app.use(cors({
            origin: 'http://localhost:8080', //frontend origin
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true // Enable if using cookies or authentication headers
        }));

        app.use(cookieParser());
        app.use(express.json());

        app.use('/', rout);

        return app;
    }

    private createServer(): Server {
        return createServer(this.app);
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}`);
        });
    }
}

export default App;