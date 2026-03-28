import { title } from "node:process";
import prisma from "../util/prismaClient.js";

class Cart {
    static async addToCart(userId, productId, action) {
        try{
            const result = await prisma.$transaction(async (prisma) => {
                let getOrder = await prisma.order.findFirst({
                    where: {
                        userId: userId,
                        currentStatus: 'CREATED',
                    },
                });
                if (!getOrder) {
                    getOrder = await prisma.order.create({
                        data: {
                            userId: userId,
                            totalAmount: 0,
                        },
                    });
                    await prisma.orderStatus.create({
                        data: {
                            orderId: getOrder.id,
                            status: "CREATED",
                        },
                    });
                }
                const existingOrderItem = await prisma.orderItem.findUnique({
                    where: {
                        orderId_productId: {
                            orderId: getOrder.id,
                            productId: productId,
                        },
                    },
                });
                if (action === 'add') {
                    if (existingOrderItem) {
                        await prisma.orderItem.update({
                            where: { id: existingOrderItem.id },
                            data: { qty: {increment:1} },
                        });
                    } else {
                        await prisma.orderItem.create({
                            data: {
                                orderId: getOrder.id,
                                productId: productId,
                                qty: 1,
                            },
                        });
                    }   
                }else if (action === 'delete') {
                    if (!existingOrderItem) throw new Error("Item not in cart");
                    if (existingOrderItem.qty > 1) {
                        await prisma.orderItem.update({
                            where: { id: existingOrderItem.id },
                            data: { qty: { decrement: 1 } }
                        });
                    } else {
                        await prisma.orderItem.delete({
                            where: { id: existingOrderItem.id }
                        });
                    }
                }

                const allItems = await prisma.orderItem.findMany({
                    where: { orderId: getOrder.id },
                    include: {
                        product: {
                            select: {
                                price: true,
                            },
                        },
                    },
                });
                const totalAmount = allItems.reduce((total, item) => total + item.qty * item.product.price, 0);
                await prisma.order.update({
                    where: { id: getOrder.id },
                    data: { totalAmount },
                });
            });
            return true;

        }catch(err){
            console.log(err);
            throw new Error("Failed to add product to order");
        }
    }

    static async getCart(userId, orderId=null) {
        try{
            const condition = {
                userId: userId,
                currentStatus: 'CREATED'
            }
            if(orderId){
                condition.id = orderId;
            }
            const order = await prisma.order.findFirst({
                where: condition,
                include: {
                    items: {
                        include: {
                            product: {
                                include: { file: true } // Includes the product image/file
                            }
                        }
                    }
                }
            });
            if (!order) {
                return { products: [], totalAmount: 0 };
            }
            const products = order.items.map(item => ({
                ...item.product,
                quantity: item.qty
            }));
            return {products, totalAmount: order.totalAmount};
        }catch(err){
            console.log(err);
            throw new Error("Failed to get order details");
        }
    }

    static async deleteFromCart(userId, productId) {
        try{
            const result = await prisma.$transaction(async (prisma) => {
                 let getOrder = await prisma.order.findFirst({
                    where: {
                        userId: userId,
                        currentStatus: 'CREATED',
                    },
                });
                if (!getOrder) {
                    throw new Error("No active order found");
                }
                const existingOrderItem = await prisma.orderItem.findUnique({
                    where: {
                        orderId_productId: {
                            orderId: getOrder.id,
                            productId: productId,
                        },
                    },
                });
                if (!existingOrderItem) {
                    throw new Error("Product not in the order");
                }
                await prisma.orderItem.delete({
                    where: { id: existingOrderItem.id }
                });

                const allItems = await prisma.orderItem.findMany({
                    where: { orderId: getOrder.id },
                    include: {
                        product: {
                            include: { 
                                file: true 
                            }
                        },
                    },
                });

                if (allItems.length === 0) {
                    await prisma.order.delete({
                        where: { id: getOrder.id },
                    });
                    return {products: [], totalAmount: 0};
                }else{
                    const products = allItems.map(item => ({
                        ...item.product,
                        quantity: item.qty
                    }));
                    const totalAmount = allItems.reduce((total, item)  => total + item.qty * item.product.price, 0);
                    await prisma.order.update({
                        where: { id: getOrder.id },
                        data: { totalAmount },
                    });
                    return {products, totalAmount};
                }
            });
                return result;
        }catch(err){
            throw new Error("Failed to remove product from the order");
        }
    }

    static updatePaymentStatus = async (userId, orderId, status) => {
        console.log("Updating payment status for orderId:", orderId, "to status:", status);
        try{
            const result = await prisma.$transaction(async (prisma) => {
                const order = await prisma.order.findFirst({
                    where: {
                        id: orderId,
                        userId: userId,
                    },
                });
                if (!order) {
                    throw new Error("Order not found");
                }
                console.log("Order found for payment status update:", order);
                await prisma.order.update({
                    where: { id: orderId },
                    data: { currentStatus: status },
                });

                await prisma.orderStatus.create({
                    data: {
                        orderId: orderId,
                        status: status,
                    },
                });
            });
            return true;
        }catch(err){
            console.log(err);
            throw new Error("Failed to update payment status");
        }
    }
}
export default Cart;