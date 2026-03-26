import express from 'express';
import productController from '../controllers/product.js';

const router = express.Router();

router.use((req, res, next) => {
    // let cookies = req.headers.cookie;
    // let token = cookies.split("=")[1];
    // if(token !== "abc1234"){
    //     return res.status(401).json({message: "Unauthorized"});
    // }
    console.log(req.session.loggedIn);
    next();
});
router.route('/')
    .post(productController.addProduct)
    .get(productController.getProducts)
router.route('/:id')
    .patch(productController.updateProduct)
    .get(productController.getProduct)
    .delete(productController.deleteProduct)

export default router;