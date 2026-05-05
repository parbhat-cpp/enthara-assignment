import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import apiRoutes from './routes';
import ConnectDB from './config/db';

const app: Express = express();

ConnectDB();

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
