import { GraphQLError } from 'graphql';
import validator from 'validator';
import ProductModel from '../models/product.js';

class ProductResolvers {

    static createProduct = async (obj, args, context) => {
        try{
            const { user:{userId}, isAuth } = context;
             if(!isAuth){
                 throw new GraphQLError("Unauthorized", {
                     extensions: {
                         code: 401,
                     },
                 });
             }
             const { title, description, price } = args;
            
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

        }catch(err){
            throw new GraphQLError(err.message, {
                extensions: {
                    code: err.extensions?.code || 500,
                },
            });
        }
     }
    static updateProduct = async (obj, args, context) => {
        try{
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

        }catch(err){
            throw new GraphQLError(err.message, {
                extensions: {
                    code: err.extensions?.code || 500,
                },
            });
        }
     }

     static deleteProduct = async (obj, args, context) => {
        try{
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

        }catch(err){
            throw new GraphQLError(err.message, {
                extensions: {
                    code: err.extensions?.code || 500,
                },
            });
        }
     }

     static getProduct = async (obj, args, context) => {
        try{
            const { user:{userId}, isAuth } = context;
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

        }catch(err){
            throw new GraphQLError(err.message, {
                extensions: {
                    code: err.extensions?.code || 500,
                },
            });
        }
    }
    static getProducts = async (obj, args, context) => {
        try{
            const { user:{userId}, isAuth } = context;
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

        }catch(err){
            throw new GraphQLError(err.message, {
                extensions: {
                    code: err.extensions?.code || 500,
                },
            });
        }
    }
}

export default ProductResolvers;