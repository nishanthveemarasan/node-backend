import express from 'express';

import productRoute from './routes/product.js';
import UserModel from './models/user.js';
import cartRoute from './routes/cart.js';
import {get404} from './controllers/error.js';

// import { mongoConnect } from './util/databaseMongoDB';

const app = express();

app.use(express.json());

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

app.use(get404);

// mongoConnect(() => {
// });
app.listen(3000);
