import { body } from 'express-validator';
import ProductModel from '../models/product.js';
export const addToCartValidator = [
    body('id')
        .notEmpty()
        .withMessage('Product ID must be an integer')
        .custom(async(value) => {
            const product = await ProductModel.findById(value);
            if(!product){
                return Promise.reject('Product with given ID does not exist');
            }
        }),
    body('action')
        .notEmpty()
        .isString()
        .isIn(['add', 'delete'])
        .withMessage('Action must be either increment or decrement'),
]