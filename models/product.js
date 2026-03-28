import { url } from "node:inspector";
import prisma from "../util/prismaClient.js";

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  async save(userId) {
    try {
      const product = await prisma.product.create({
        data: {
            title: this.title,
            price: this.price,
            description: this.description,
            user:{
                connect: {id: userId}
            }
        },
      });
      console.log("Product created:", product);
      if(this.imageUrl){
        await prisma.files.create({
            data: {
                url: this.imageUrl,
                product: {
                    connect: {id: product.id}
                }
            }
        });
      }
      return product;
    } catch (err) {
      console.error("Error saving product:", err);
    }
  }

  static async fetchAll(userId, pageNumber = 1) {
    try {
      const limmit = 25;
      const offset = (pageNumber - 1) * limmit;
      const products = await prisma.product.findMany({
        where: {
            userId: userId
        },
        include:{
            file: {
                select: {
                    url: true
                }
            }
        },
        skip: offset,
        take: limmit,

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
