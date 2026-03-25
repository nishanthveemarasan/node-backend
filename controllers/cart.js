const CartModel = require("../models/cart");
const ProductModel = require("../models/product");

exports.addToCart = async(req, res, next) => {
    const {id:productId, price:productPrice} = req.body;
    try{
        const user = req.user;
        let cart = await user.getCart();
        if(!cart){
            cart = await user.createCart();
        }
        const cartProducts = await cart.getProducts({ where: { id: productId } });
        let newQuantity = 1;
        if(cartProducts.length > 0){
            const existingProduct = cartProducts[0];
            newQuantity = existingProduct.CartItem.quantity + 1;
            await existingProduct.CartItem.update({ quantity: newQuantity });
        }else{
            const product = await ProductModel.findByPk(productId);
            if(product){
                await cart.addProduct(product, { through: { quantity: newQuantity } });
            }
        }
        res.status(200).json({ message: `Product with id ${productId} added to cart` });

    }catch(err){
        console.log(err);
    }

   
}

exports.getCart = async(req, res, next) => {
    try{
        const user = req.user;
        const cart = await user.getCart();
        if(!cart){
            return res.status(404).json({ message: 'Cart not found', cart: null }); 
        }
        const products = await cart.getProducts();
        res.status(200).json({ message: 'Cart fetched', cart: { products } });
    }catch(err){
        console.log(err);
    }
   
}

exports.deleteFromCart = async(req, res, next) => {
    try{
        const user = req.user;
        const cart = await user.getCart();
        const {id:productId} = req.params;
        if(!cart){
            return res.status(404).json({ message: 'Cart not found' }); 
        }
        const cartProducts = await cart.getProducts({ where: { id: productId } });
        if(cartProducts.length === 0){
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const product = cartProducts[0];
        await cart.removeProduct(product);

        res.status(200).json({ message: `Product with id ${productId} deleted from cart` });


    }catch(err){
        console.log(err);
    }

}