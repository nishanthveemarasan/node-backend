const { ObjectId } = require("mongodb");
const { getDB } = require("../util/databaseMongoDB");

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  async save() {
    try {
      const db = getDB();
      const result = await db.collection("products").insertOne(this);
      return result;
    } catch (err) {
      console.error("Error saving product:", err);
    }
  }

  static async fetchAll() {
    try {
      const db = getDB();
      const products = await db.collection("products").find().toArray();
      return products;
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  static async findById(id) {
    try {
      const db = getDB();
      const product = await db
        .collection("products")
        .findOne({ _id: new ObjectId(id) });
      return product;
    } catch (err) {
      console.error("Error finding product by ID:", err);
    }
  }

    static async update(id, updatedData) {
    try {
      const db = getDB();
      const result = await db
        .collection("products")
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      return result;
    } catch (err) {
      console.error("Error updating product:", err);
    }
  }

   static async delete(id) {
    try {
      const db = getDB();
      const result = await db
        .collection("products")
        .deleteOne({ _id: new ObjectId(id) });
      return result;
    } catch (err) {
      console.error("Error deleting product:", err);
    }
   }
}

module.exports = Product;
