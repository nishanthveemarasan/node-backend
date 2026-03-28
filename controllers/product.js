import ProductModel from '../models/product.js';
import { getIo } from '../util/socket.js';

class ProductController {
    static addProduct = async (req, res, next) => {
        const {title, price, description} = req.body;
        const imageUrl = req.file ? req.file.path : null;
        if(!imageUrl){
            throw new Error('Image is required');
        }
        const user = req.user;
        try{
            const product = new ProductModel(
               title,
               parseFloat(price),
               imageUrl,
               description
            );
            const result = await product.save(user.userId);
            getIo().emit('product_changed', result);
            console.log('Product created:', result);
            res.status(201).json({ message: 'Product created', result });
    
        }catch(err){
            const error = new Error(err)
            error.httpStatusCode = 500;
            next(error);
        }
    }
    
    static getProducts = async(req, res, next) => {
        try{
            const {page:pageNumber=1} = req.query;
            console.log(pageNumber);
            const user = req.user;
            const products = await ProductModel.fetchAll(user.id, pageNumber);
            if(products){
                // console.log('Products fetched:', products.map(p => p.toJSON()));
                res.status(200).json({ message: 'Products fetched', products });
            }else{
                res.status(404).json({ message: 'No products found' });
            }
    
        }catch(err){
            console.log(err);
        }
    }
    
    static getProduct = async (req, res, next) => {
        const {id:productId} = req.params;
        try{
            const user = req.user;
            const product = await ProductModel.findById(productId);
              if (product) {
                res.status(200).json({ message: 'Product fetched', product: product });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        }catch(err){
            console.log(err);
        }
    }
    
    static updateProduct = async(req, res, next) => {
        const {edit} = req.query;
        const {id:productId} = req.params;
        const {title, price, description} = req.body;
        const imageUrl = req.file ? req.file.path : null;
        try{
            const user = req.user;
            const editData = {
                title,
                price: parseFloat(price),
                description
            }
            if(imageUrl){
                editData.imageUrl = imageUrl;
            }
            const updatedProduct = await ProductModel.update(user.id, productId, editData);
             if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated', updatedProduct });
        }catch(err){
            console.log(err);
        }
        
    }
    
    static deleteProduct = async(req, res, next) => {
        const {id:productId} = req.params;
        try{
            const user = req.user;
            const product = await ProductModel.delete(user.id, productId);
             if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }else{
                res.status(200).json({ message: 'Product deleted', product });
            }
    
        }catch(err){
        }
    }
}

export default ProductController; 