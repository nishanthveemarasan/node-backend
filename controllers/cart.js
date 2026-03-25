const CartModel = require("../models/cart");
const ProductModel = require("../models/product");

exports.addToCart = (req, res, next) => {
    const {id:productId, price:productPrice} = req.body;
    CartModel.addProduct(productId, productPrice);

    res.status(200).json({ message: `Product with id ${productId} added to cart` });
}

exports.getCart = (req, res, next) => {
    CartModel.getCart((cart) => {
        if (cart) {
            res.status(200).json({ message: 'Cart fetched', cart });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    });
}

exports.deleteFromCart = (req, res, next) => {
    const {id:productId} = req.params;
    ProductModel.findById(productId, (product) => {
        CartModel.deleteProduct(product.id, product.price);
    });
    res.status(200).json({ message: `Product with id ${productId} deleted from cart` });
}