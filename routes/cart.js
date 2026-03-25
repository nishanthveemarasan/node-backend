const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cart');

router.route('/')
    .post(cartController.addToCart)
    .get(cartController.getCart);
router.delete('/:id', cartController.deleteFromCart);

module.exports = router;