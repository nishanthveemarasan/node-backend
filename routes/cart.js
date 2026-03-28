import express from 'express';

const router = express.Router();

import cartController from '../controllers/cart.js';
import { addToCartValidator } from '../validators/cart-validator.js';
import inputValidateMiddleware from '../middleware/validate.js';
router.route('/')
    .post(addToCartValidator,inputValidateMiddleware, cartController.addToCart)
    .get(cartController.getCart);
router.delete('/:id', cartController.deleteFromCart);
router.post('/checkout', cartController.checkout);
router.get('/payment-link/:id', cartController.generatePaymentLink);

export default router;