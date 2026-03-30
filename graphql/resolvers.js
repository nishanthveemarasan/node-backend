import UserModal from '../models/user.js';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import ProductModel from '../models/product.js';
const resolvers = {
    Mutation: {
        signUp: async (obj,args, context) => {
            const { name, email, password, password_confirmation } = args;
            const errors = [];
            if (validator.isEmpty(name)) {
                errors.push("Name is required");
            }
            if(!validator.isEmail(email)){
                errors.push("Invalid email");
            }
            if(!validator.isLength(password, { min: 6 })){
                errors.push("Password must be at least 6 characters long");
            }
            if(password !== password_confirmation){
                errors.push("Password confirmation does not match password");
            }
            const userExists = await UserModal.findByEmail(email);
            if (userExists) {
                errors.push("User already exists");
            }
            if(errors.length > 0){
                throw new GraphQLError("Validation failed", {
                    extensions: {
                        code:422,
                        data: errors,
                    },
                });
               }
            if (password !== password_confirmation) {
                throw new Error("Password confirmation does not match password");
            }
            const hashPassword = await bcrypt.hash(password, 12 );
            const newUser = new UserModal(null, name, email, hashPassword);
            const user = await newUser.save();
            return user;
        },
        login: async (_, args, context) => {
            const { username, password } = args;    
            const user = await UserModal.findByEmail(username);
            if (!user) {
                throw new GraphQLError("Invalid username or password", {
                    extensions: {
                        code: 500,
                    },
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new GraphQLError("Invalid username or password", {
                    extensions: {
                        code: 500,
                    },
                });
            }
             const token = jwt.sign({userId: user.id, email:user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
            return { token, message: "Login successful" };
        },
        
        createProduct: async (_, args, context) => {
           const { user:{userId}, isAuth } = context;
            if(!isAuth){
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: 401,
                    },
                });
            }
            const { title, description, price } = args;
            console.log(title, description, price);
            
            const errors = [];
            if (validator.isEmpty(title)) {
                errors.push("Title is required");
            }
            if (validator.isEmpty(description)) {
                errors.push("Description is required");
            }
            if (!validator.isFloat(price.toString(), { min: 0 })) {
                errors.push("Price must be a positive number");
            }
            if(errors.length > 0){
                throw new GraphQLError("Validation failed", {
                    extensions: {
                        code:422,
                        data: errors,
                    },
                });
               }
            let imageUrl = "uploads/default-product.png";
            const product = new ProductModel(
                title,
                parseFloat(price),
                imageUrl,
                description
             );
             const createdProduct = await product.save(userId);
            return { message: "Product created successfully", product: createdProduct };
        },
        updateProduct: async (_, args, context) => {
            const { user:{userId}, isAuth } = context;
            if(!isAuth){
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: 401,
                    },
                });
            }
            const { id:productId, ...editData } = args;
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new GraphQLError("Product not found", {
                    extensions: {
                        code: 404,
                    },
                });
            }
            if (product.userId !== userId) {
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: 401,
                    },
                });
            }
            const errors = [];
            const { title, description, price } = editData;
            if (title && validator.isEmpty(title)) {
                errors.push("Title cannot be empty");
            }
            if (description && validator.isEmpty(description)) {
                errors.push("Description cannot be empty");
            }
            if (price !== undefined && !validator.isFloat(price.toString(), { min: 0 })) {
                errors.push("Price must be a positive number");
            }
            if(errors.length > 0){
                throw new GraphQLError("Validation failed", {
                    extensions: {
                        code:422,
                        data: errors,
                    },
                });
            }

            const updatedProduct = await ProductModel.update(userId, productId, editData);
             return { message: "Product updated successfully", product: updatedProduct };
        },

        deleteProduct: async (_, args, context) => {
            const { user:{userId}, isAuth } = context;
            if(!isAuth){
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: 401,
                    },
                });
            }
            const { id:productId } = args;
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new GraphQLError("Product not found", {
                    extensions: {
                        code: 404,
                    },
                });
            }
            if (product.userId !== userId) {
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: 401,
                    },
                });
            }
            await ProductModel.delete(userId, productId);
             return { message: "Product deleted successfully" };
        }
        
    },
    Query: {
        getProduct: async (_, args, context) => {
            const { user:{userId}, isAuth } = context;
            console.log(userId, isAuth);
            if(!isAuth){
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: 401,
                    },
                });
            }
            const { id } = args;
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new GraphQLError("Product not found", {
                    extensions: {
                        code: 404,
                    },
                });
            }
            if (product.userId !== userId) {
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: 401,
                    },
                });
            }
            return { message: "Product fetched successfully", product };
        },
        getProducts: async (_, args, context) => {
            const { user:{userId}, isAuth } = context;
            console.log(userId, isAuth);
            if(!isAuth){
                throw new GraphQLError("Unauthorized", {
                    extensions: {
                        code: 401,
                    },
                });
            }
            const { page: pageNumber = 1 } = args;
            const products = await ProductModel.fetchAll(userId, pageNumber);
            return { products, currentPage: pageNumber };
        }
    }

};

export default resolvers;