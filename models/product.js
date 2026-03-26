import prisma from "../util/prismaClient.js";

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  async save(userId) {
    console.log(userId)
    try {
      const result = await prisma.product.create({
        data: {
            ...this,
            user:{
                connect: {id: userId}
            }
        },
      });
      console.log("Product saved:", result);
      return result;
    } catch (err) {
      console.error("Error saving product:", err);
    }
  }

  static async fetchAll(userId) {
    try {
      const products = await prisma.product.findMany({
        where: {
            userId: userId
        }
      });
      return products;
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  static async findById(id) {
    try {
      const product = await prisma.product.findUnique({
        where: {
            id: id
        }
      });
      return product;
    } catch (err) {
      console.error("Error finding product by ID:", err);
    }
  }

    static async update(userId, productId, updatedData) {
    try {
      const result = await prisma.product.update({
        where: {
            id: productId,
            userId: userId
        },
        data: updatedData
      });
      return result;
    } catch (err) {
      console.error("Error updating product:", err);
    }
  }

   static async delete(userId, productId) {
    try {
      const result = await prisma.product.delete({
        where: {
            id: productId,
            userId: userId
        }
      });
      return result;
    } catch (err) {
      console.error("Error deleting product:", err);
    }
   }
}

export default Product;
