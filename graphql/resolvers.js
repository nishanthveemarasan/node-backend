import AuthResolvers from './resolvers/auth-resolvers.js';
import ProductResolvers from './resolvers/product-resolver.js';
const resolvers = {
    Mutation: {
        signUp: AuthResolvers.signUp,
        login: AuthResolvers.login,
        createProduct:ProductResolvers.createProduct,
        updateProduct: ProductResolvers.updateProduct,
        deleteProduct: ProductResolvers.deleteProduct,
    },
    Query: {
        getProduct: ProductResolvers.getProduct,
        getProducts: ProductResolvers.getProducts,
    }
};

export default resolvers;