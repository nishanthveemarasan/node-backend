import express from 'express';

import productRoute from './routes/product.js';
import UserModel from './models/user.js';
import cartRoute from './routes/cart.js';
import {get404} from './controllers/error.js';
import authRouter from './routes/auth.js';

import session from 'express-session';
import { PrismaClient } from "./generated/prisma/client.ts";
import  {PrismaSessionStore} from '@quixo3/prisma-session-store';

const app = express();

app.use(express.json());

// app.use(session({
//     secret: 'mysecret', // will be used to sign the session ID cookie
//     resave: false, // session will not be saved back to the session store unless it was modified during the request
//     saveUninitialized: false, // session will not be saved for uninitialized sessions (sessions that are new but not modified)
// })); 

app.use(
    session({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: 'a santa at nasa',
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

app.use(async(req, res, next) => {
    try{
        const user = await UserModel.findById("69c5231f5faa257cdaf9de9b");
        if(user){
            req.user = user;
        }
    }catch(err){
        console.log(err);
    }
    next();
});


app.use('/product',productRoute);
app.use('/cart',cartRoute);
app.use('/auth', authRouter);

app.use(get404);

app.listen(3000);
