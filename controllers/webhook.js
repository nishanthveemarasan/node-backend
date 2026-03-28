import CartModel from "../models/cart.js";
class WebhookController {
    static paymentSuccess = async (req, res, next) => {
        const data = req.body;
        const stripeData = data.object;
        const paymentStatus = stripeData.paid ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED';
        const userId = stripeData.metadata.userId;
        const orderId = stripeData.metadata.orderId;
        try{
            await CartModel.updatePaymentStatus(userId, orderId, paymentStatus);
        }catch(err){
            console.log(err);
           
        }
    }

    static paymentFailed = async (req, res, next) => {
        const data = req.body;
        const stripeData = data.object;
        const paymentStatus = 'PAYMENT_FAILED';
        const userId = stripeData.metadata.userId;
        const orderId = stripeData.metadata.orderId;
        try{
            await CartModel.updatePaymentStatus(userId, orderId, paymentStatus);
        }catch(err){
            console.log(err);
         }
    }
}

export default WebhookController;