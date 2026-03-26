import { title } from "node:process";
import prisma from "../util/prismaClient.js";

class Cart {
    static async addToCart(userId, productId) {
        try{
            const cart = await prisma.cart.upsert({
                where: { userId: userId },
                update: {},
                create: { userId: userId },
            });

            const existingCartItem = await prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: productId,
                    },
                },
            });

            if (existingCartItem) {
                await prisma.cartItem.update({
                    where: { id: existingCartItem.id },
                    data: { qty: existingCartItem.qty + 1 },
                });
            } else {
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: productId,
                        qty: 1,
                    },
                });
            }

        }catch(err){
            console.log(err);
        }
    }

    static async getCart(userId) {
        try{
            console.log(userId);
            const cartItem = await prisma.cart.findUnique({
                where: { userId: userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select:{
                                    title: true,
                                    price: true,
                                    description: true,
                                    imageUrl: true,
                                }
                            },
                           
                        },
                    },
                },
            });
            if (!cartItem) {
                return { products: [] };
            }
            const formattedProducts = cartItem.items.map(item => ({
                ...item.product,
                quantity: item.qty
            }));
            return formattedProducts;
        }catch(err){
            console.log(err);
        }
    }

    static async deleteFromCart(userId, productId) {
        try{
            const cart = await prisma.cart.findUnique({
                where: { userId: userId },
            });
            if (!cart) {
                return null;
            }
            await prisma.cartItem.delete({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: productId
                    }
                }
            });
        }catch(err){
            console.log(err);
        }
    }
}
export default Cart;