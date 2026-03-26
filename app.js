const express = require('express');

const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const errorController = require('./controllers/error');

const { mongoConnect } = require('./util/databaseMongoDB');

const app = express();

app.use(express.json());

app.use(async(req, res, next) => {
    // try{
    //     const user = await UserModel.findByPk(1);
    //     if(user){
    //         req.user = user;
    //     }
    // }catch(err){
    //     console.log(err);
    // }
    next();
});


app.use('/product',productRoute);
app.use('/cart',cartRoute);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});
