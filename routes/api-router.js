import express from 'express';

const router = express.Router();
import productRoute from './product.js';
import cartRoute from './cart.js';
import authCheckMiddleware from '../middleware/auth-check.js';

router.use(authCheckMiddleware);
router.use('/product',productRoute);
router.use('/cart',cartRoute);


export default router;