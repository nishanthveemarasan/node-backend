const typeDefs = `#graphql
    type AuthData{
        token: String!
        message: String!
    }

    type File {
        id: ID!
        url: String!
        productId: ID!
    }
    type Product {
        id: ID!
        title: String!
        description: String!
        price: Float!
        userId: ID!
        file: File
    }
    type User {
        id: ID!
        name: String!
        email: String!
        products: [Product]!
    }

    type CreateProductData{
        message: String!
        product: Product!
    }
    type ProductPaginationData{
        products: [Product]!
        currentPage: Int!
    }

    type DeleteProductData{
        message: String!
    }

    type Mutation {
        signUp(name: String!, email:String!, password: String!, password_confirmation: String!): User!
        login(username: String!, password: String!): AuthData!
        createProduct(title: String!, description: String!, price: Float!): CreateProductData!
        updateProduct(id: ID!, title: String, description: String, price: Float): CreateProductData!
        deleteProduct(id: ID!): DeleteProductData!
    }
        
    type Query {
        me: User
        getProduct(id: ID!): CreateProductData!
        getProducts(page: Int): ProductPaginationData!
  }  
   
`;

export default typeDefs;