import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {typeDefs} from './typeDefs';
import {resolvers} from './resolvers';
import {connectDB} from './db';
import dotenv from 'dotenv';


dotenv.config();
const PORT = process.env.PORT || 7771;

const app = express();
connectDB();


app.get('/', (req: any, res: any) => res.send('Welcome to my api') );


app.use('/private', (_:any, res:any) => res.status(404).send('Not found Page') );

module.exports = app;

async function start() {
    

    const apolloServer = new ApolloServer({
        typeDefs:typeDefs,
        resolvers:resolvers,
        introspection: true ,        
    })

    await apolloServer.start();

    apolloServer.applyMiddleware({app:app});

    const port = PORT;

    app.listen(port, () => {
        console.log('Server on port', port);
    });
};

start();