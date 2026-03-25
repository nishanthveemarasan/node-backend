const express = require('express');

const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const errorController = require('./controllers/error');

const sequelize = require('./util/databaseSequelize');
const ProductModel = require('./models/product');
const UserModel = require("./models/user");
const CartModel = require('./models/cart');
const CartItemModel = require('./models/cart-item');
const app = express();

app.use(express.json());

app.use(async(req, res, next) => {
    try{
        const user = await UserModel.findByPk(1);
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

app.get('/',(req, res, next) => {
   res.send('Hello, World!');
});

app.use(errorController.get404);

ProductModel.belongsTo(UserModel, { constraints: true, onDelete: 'CASCADE' });
UserModel.hasMany(ProductModel);
UserModel.hasOne(CartModel);
CartModel.belongsTo(UserModel);
CartModel.belongsToMany(ProductModel, { through: CartItemModel });
ProductModel.belongsToMany(CartModel, { through: CartItemModel });
// sequelize.sync({ force: true }) // auto update tables
//   .then(() => console.log('Tables synced'))
//   .catch(err => console.error(err));

app.listen(3000);