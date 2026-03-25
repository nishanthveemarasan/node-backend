const fs = require("fs");
const path = require("path");
const CartModel = require('./cart');
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};
module.exports = class Product {
  constructor(t, p, id=null) {
    this.id = id || Math.random().toString();
    this.title = t;
    this.price = p;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static update(id, title, price) {
    getProductsFromFile((products) => {
        const updatedProducts = [...products];
      const productIndex = updatedProducts.findIndex(p => p.id === id);
      if (productIndex >= 0) {
        const updatedProduct = new Product(title, price, id);
        updatedProducts[productIndex] = updatedProduct;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      }
    });

  }

  static delete(id) {
    getProductsFromFile((products) => {
        const product = products.find(p => p.id === id);
        const updatedProducts = products.filter(p => p.id !== id);
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if(!err){
            CartModel.deleteProduct(id, product.price);
          }
        });
    });
  }
   

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
