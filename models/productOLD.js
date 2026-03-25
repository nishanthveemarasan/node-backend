const CartModel = require('./cart');
const db = require('../util/databaseSQL');

module.exports = class Product {
  constructor(t, p, id=null) {
    this.id = id || Math.random().toString();
    this.title = t;
    this.price = p;
  }

  save() {
    return db.execute('INSERT INTO products (title, price) VALUES (?, ?)', [this.title, this.price])
  }

  static update(id, title, price) {
    return db.execute('UPDATE products SET title = ?, price = ? WHERE products.id = ?', [title, price, id])
  }

  static delete(id) {
    return db.execute('DELETE FROM products WHERE products.id = ?', [id])
  }
   

  static fetchAll() {
    return db.execute('SELECT * FROM products')
    
  }

  static findById(id) {
   return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
  }
};
