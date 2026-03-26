import { ObjectId } from "mongodb";
import prisma from "../util/prismaClient.js";

class User {
    constructor(id, name, email) {
        this.name = name;
        this.email = email;
    }

    async save() {
        try {
            const result = await prisma.user.create({
                data: this
            });
            console.log("User saved:", result);
            return result;
        } catch (err) {
            console.error("Error saving user:", err);
        }
    }

    static async findById(id) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: new ObjectId(id) }
            });
            return user;
        } catch (err) {
            console.error("Error finding user by ID:", err);
        }
    }
}

export default User;