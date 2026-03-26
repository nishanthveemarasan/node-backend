import ProductModel from '../models/product.js';

class ProductController {
    static addProduct = async (req, res, next) => {
        const {title, price, description, imageUrl} = req.body;
        const user = req.user;
        try{
            const product = new ProductModel(
               title,
               price,
               imageUrl,
               description
            );
            const result = await product.save(user.id);
            console.log('Product created:', result);
            res.status(201).json({ message: 'Product created', result });
    
        }catch(err){
    
        }
    }
    
    static getProducts = async(req, res, next) => {
        try{
            const user = req.user;
            const products = await ProductModel.fetchAll(user.id);
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
        const {title, price, description, imageUrl} = req.body;
        try{
            const user = req.user;
            const updatedProduct = await ProductModel.update(user.id, productId, {
                title,
                price,
                description,
                imageUrl
            });
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