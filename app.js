import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {get404} from './controllers/error.js';
import apiRouter from './routes/api-router.js';
import publicRouter from "./routes/public-router.js";
import errorResponseMiddleware from './middleware/error-response.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, 'uploads'); 
app.use('/uploads', express.static(uploadsPath));

app.use(express.json());

app.use(publicRouter);
app.use('/api', apiRouter);

app.use(get404);

app.use(errorResponseMiddleware);

app.listen(3000);
