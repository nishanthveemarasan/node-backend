const ProductModel = require('../models/product');
exports.addProduct = (req, res, next) => {
    const data = req.body;
    const product = new ProductModel(data.title, data.price);
    product.save();
    res.status(200).json({ message: 'Product created', data });
}

exports.getProducts = (req, res, next) => {
    ProductModel.fetchAll((products) => {

        res.status(200).json({ message: 'Products fetched', products });
    });
}

exports.getProduct = (req, res, next) => {
    const {id:productId} = req.params;
    ProductModel.findById(productId, (product) => {
        if (product) {
            res.status(200).json({ message: 'Product fetched', product });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
}

exports.updateProduct = (req, res, next) => {
    const {edit} = req.query;
    const {id:productId} = req.params;
    const {title, price} = req.body;
    ProductModel.update(productId, title, price);
    res.status(200).json({ message: 'Product updated', productId, title, price, edit });
}

exports.deleteProduct = (req, res, next) => {
    const {id:productId} = req.params;
    ProductModel.delete(productId);
    res.status(200).json({ message: 'Product deleted', productId });
}