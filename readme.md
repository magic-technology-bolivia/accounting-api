npm i -D typescript ts-node-dev

// add line in package.json
"scripts": {
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc -p ."
}

npm i express apollo-server-express dotenv graphql mongoose
