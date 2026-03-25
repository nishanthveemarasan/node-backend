const ProductModel = require('../models/product');
exports.addProduct = async (req, res, next) => {
    const {title, price, description, imageUrl} = req.body;
    const user = req.user;
    try{
        const product = await user.createProduct({
           title,
           price,
           description,
           imageUrl
       })
       console.log('Product created:', product.toJSON());
        res.status(201).json({ message: 'Product created', product });

    }catch(err){

    }
}

exports.getProducts = async(req, res, next) => {
    try{
        const user = req.user;
        const products = await user.getProducts();
        if(products){
            console.log('Products fetched:', products.map(p => p.toJSON()));
            res.status(200).json({ message: 'Products fetched', products });
        }else{
            res.status(404).json({ message: 'No products found' });
        }

    }catch(err){
        console.log(err);
    }
}

exports.getProduct = async (req, res, next) => {
    const {id:productId} = req.params;
    try{
        const user = req.user;
        const products = await user.getProducts({
            where: { id: productId }
        });
          if (products) {
            res.status(200).json({ message: 'Product fetched', product: products[0] });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    }catch(err){
        console.log(err);
    }
}

exports.updateProduct = async(req, res, next) => {
    const {edit} = req.query;
    const {id:productId} = req.params;
    const {title, price, description, imageUrl} = req.body;
    try{
        const updatedProduct = await ProductModel.update(
            { title, price, description, imageUrl },
            {where:{id: productId}}
        );
        res.status(200).json({ message: 'Product updated', updatedProduct });
    }catch(err){
        console.log(err);
    }
    
}

exports.deleteProduct = async(req, res, next) => {
    const {id:productId} = req.params;
    try{
        const product = await ProductModel.destroy({where:{id: productId}});
         if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }else{
            res.status(200).json({ message: 'Product deleted', product });
        }

    }catch(err){
    }
}