import CartModel from "../models/cart.js";
import ProductModel from "../models/product.js";

class CartController {
    static addToCart = async(req, res, next) => {
        const {id:productId, price:productPrice} = req.body;
        try{
            const user = req.user;
            await CartModel.addToCart(user.id, productId);
           res.status(200).json({ message: `Product with id ${productId} added to cart` });
    
        }catch(err){
            console.log(err);
        }
    
       
    }
    
    static getCart = async(req, res, next) => {
        try{
            const user = req.user;
            const products = await CartModel.getCart(user.id);
            // if(!cart){
            //     return res.status(404).json({ message: 'Cart not found', cart: null }); 
            // }
            // const products = await cart.getProducts();
            res.status(200).json({ message: 'Cart fetched', cart: { products } });
        }catch(err){
            console.log(err);
        }
       
    }
    
    static deleteFromCart = async(req, res, next) => {
        try{
            const user = req.user;
            const {id:productId} = req.params;
            const response = await CartModel.deleteFromCart(user.id, productId);
    
            res.status(200).json({ message: `Product with id ${productId} deleted from cart` });
    
    
        }catch(err){
            console.log(err);
        }
    
    }
}
export default CartController;
