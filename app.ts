const express = require('express');
const {ApolloServer} = require('apollo-server-express');

const {typeDefs} = require('./typeDefs');
const {resolvers} = require('./resolvers');

const {connectDB} = require('./db');

const app = express();
connectDB();

app.get('/', (req: any, res: any) => res.send('Welcome to my api') );


app.use('/private', (_:any, res:any) => res.status(404).send('Not found Page') );

module.exports = app;

async function start() {

    const apolloServer = new ApolloServer({
        typeDefs:typeDefs,
        resolvers:resolvers,
    })

    await apolloServer.start();

    apolloServer.applyMiddleware({app:app});

    app.listen(3000, () => {
        console.log('Server on port', 3000);
    });
};

start();