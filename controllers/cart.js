import CartModel from "../models/cart.js";
import ProductModel from "../models/product.js";
import StripeService from "../util/stripe.js";

class CartController {
    static addToCart = async(req, res, next) => {
        const {id:productId, action} = req.body;
        try{
            const user = req.user;
             const cartAdded = await CartModel.addToCart(user.userId, productId, action);
            if(cartAdded){
                res.status(200).json({ message: `Product is updated to the cart` });
            }else{
                throw new Error('Failed to add product to cart');
            }
    
        }catch(err){
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        }
    
       
    }
    
    static getCart = async(req, res, next) => {
        try{
            const user = req.user;
            const {products, totalAmount} = await CartModel.getCart(user.id);
            res.status(200).json({ message: 'Cart fetched', orderDetails: { products, totalAmount } });
        }catch(err){
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        }
       
    }
    
    static deleteFromCart = async(req, res, next) => {
        try{
            const user = req.user;
            const {id:productId} = req.params;
           const {products, totalAmount} =  await CartModel.deleteFromCart(user.id, productId);
            res.status(200).json({ 
                message: `Product removed from the order successfully`,
                orderDetails: { products, totalAmount }
    });
   
        }catch(err){
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        }
    
    }   

    static checkout = async(req, res, next) => {
        try{
            const user = req.user;
            const result = await CartModel.checkout(user.id);
            res.status(200).json({ 
                message: `Checkout successful`,
                orderDetails: result
            });
   
        }catch(err){
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        }
    }

    static generatePaymentLink = async(req, res, next) => {
        try{
            const {id:orderId} = req.params;
            const {userId} = req.user;
            const paymentUrl = await StripeService.generatePaymentLink(userId,orderId);
            res.status(200).json({ 
                message: `Payment link generated successfully`,
                paymentLink: paymentUrl
            });
        }catch(err){
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        }
    }
}
export default CartController;
