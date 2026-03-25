const fs = require('fs');
const path = require('path');
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);
module.exports = class Cart {
    static  addProduct(productId, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(p => p.id === productId);
            const copyProducts = [...cart.products];
            if (existingProductIndex >= 0) {
                copyProducts[existingProductIndex].qty += 1;
            } else {
                copyProducts.push({ id: productId, qty: 1 });
            }
            cart.totalPrice += +productPrice;
            cart.products = [...copyProducts];
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(productId, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent);
            const existingProductIndex = cart.products.findIndex(p => p.id === productId);
            if (existingProductIndex < 0) {
                return;
            }
            const productQty = cart.products[existingProductIndex].qty;
            cart.products = cart.products.filter(p => p.id !== productId);
            cart.totalPrice -= productPrice * productQty;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb(null);
            } else {
                const cart = JSON.parse(fileContent);
                cb(cart);
            }
        });
    }
}