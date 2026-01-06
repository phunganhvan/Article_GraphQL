import express, { Express, Request, Response } from 'express';
import * as database from './config/database';
import dotenv from 'dotenv';
// import Article from './models/article.model';
import { ApolloServer, gql } from 'apollo-server-express';
// import { Query } from 'mongoose';
import { typeDefs } from './typeDefs/index.typedef';
import { resolvers } from './resolvers/index.resolver';
import { requireAuth } from './middlewares/auth.middlewares';
//Rest API
// app.get('/articles', async (req: Request, res: Response) => {
//     const article = await Article.find({
//         deleted: false
//     });
//     res.json({
//         articles: article
//     })
// });

// GraphQL API

const startServer = async () => {
    dotenv.config();
    // kết nối database
    database.connect();

    const app: Express = express();
    const port: number | string = process.env.PORT || 3000;

    const cors = require("cors");

    app.use(cors({
        origin: "https://studio.apollographql.com",
        credentials: true
    }));

    app.use(express.json());

    app.use("/graphql", requireAuth);

    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        introspection: true,
        context: ({ req, res }) => {
            return { ...req };
        }
    })
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app: app as any,
        path: '/graphql'
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
};
startServer();
