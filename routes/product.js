import express from 'express';
import productController from '../controllers/product.js';

const router = express.Router();

router.route('/')
    .post(productController.addProduct)
    .get(productController.getProducts)
router.route('/:id')
    .patch(productController.updateProduct)
    .get(productController.getProduct)
    .delete(productController.deleteProduct)

export default router;