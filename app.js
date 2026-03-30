import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import errorResponseMiddleware from './middleware/error-response.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import authCheckMiddleware from './middleware/auth-check.js';
import { get404 } from './util/404.js';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, 'uploads'); 
app.use('/uploads', express.static(uploadsPath));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
        return {
            message: err.message,
            data: err.extensions?.data || "Something went wrong",
            status: err.extensions?.code || 500,
        };
    },
});

await server.start();

app.use(authCheckMiddleware);

app.use(
    '/graphql',
    expressMiddleware(server, {
        context: async ({ req }) => {
            return { user: req?.user, isAuth: req.isAuth };
        },
    }),
  );

app.use(get404);

app.use(errorResponseMiddleware);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/graphql');
});
