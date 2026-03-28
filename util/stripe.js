import Stripe from "stripe";
import CartModel from "../models/cart.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  static generatePaymentLink = async (userId, orderId) => {
    try {
      const orderDetails = await CartModel.getCart(userId, orderId);
      const lineItems = orderDetails.products.map((product) => ({
        price_data: {
          currency: "GBP",
          product_data: {
            name: product.title,
            description: product.description,
          },
          tax_behavior: "exclusive",
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      }));
      const stripeData = {
        line_items: lineItems,
        payment_intent_data:{
          metadata: {
            userId: userId,
            orderId: orderId,
          },
        },
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/payment/user/${userId}/order/${orderId}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/user/${userId}/order/${orderId}/cancel`,
      };

      const session = await stripe.checkout.sessions.create(stripeData);
      return session.url;
    } catch (err) {
      console.log("Error generating payment link:", err);
      throw new Error("Failed to generate payment link");
    }
  };
}
export default StripeService;
