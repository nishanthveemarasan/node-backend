import express from 'express';

import {get404} from './controllers/error.js';
import apiRouter from './routes/api-router.js';
import publicRouter from "./routes/public-router.js";
import session from 'express-session';
import { PrismaClient } from "./generated/prisma/client.ts";
import  {PrismaSessionStore} from '@quixo3/prisma-session-store';

const app = express();

app.use(express.json());

app.use(
    session({
        cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
        )
    })
);

app.use(publicRouter);
app.use('/api', apiRouter);

app.use(get404);

app.listen(3000);
