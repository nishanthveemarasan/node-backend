import express from 'express';
import productController from '../controllers/product.js';
import { addProductValidator, updateProductValidator } from '../validators/product-validator.js';
import inputValidateMiddleware from '../middleware/validate.js';
import multer from 'multer';
const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});


router.route('/')
    .post(
        addProductValidator,
        // inputValidateMiddleware,
        upload.single('image'), productController.addProduct)
    .get(productController.getProducts)
router.route('/:id')
    .patch(updateProductValidator,inputValidateMiddleware,productController.updateProduct)
    .get(productController.getProduct)
    .delete(productController.deleteProduct)

export default router;