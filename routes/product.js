const express = require('express');

const router = express.Router();

const productController = require('../controllers/product');

router.route('/')
    .post(productController.addProduct)
    .get(productController.getProducts)
router.route('/:id')
    .patch(productController.updateProduct)
    .get(productController.getProduct)
    .delete(productController.deleteProduct)

module.exports = router;