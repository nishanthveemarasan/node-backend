import express from 'express';

const router = express.Router();

import cartController from '../controllers/cart.js';
router.route('/')
    .post(cartController.addToCart)
    .get(cartController.getCart);
router.delete('/:id', cartController.deleteFromCart);

export default router;