import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {get404} from './controllers/error.js';
import apiRouter from './routes/api-router.js';
import publicRouter from "./routes/public-router.js";
import errorResponseMiddleware from './middleware/error-response.js';
import { initSocket } from './util/socket.js';

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

const server = app.listen(3000);
const io = initSocket(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});
