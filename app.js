const express = require('express');

const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const errorController = require('./controllers/error');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log('Middleware 1');
    next();
});

app.use('/product',productRoute);
app.use('/cart',cartRoute);

app.get('/',(req, res, next) => {
   res.send('Hello, World!');
});

app.use(errorController.get404);

app.listen(3000);