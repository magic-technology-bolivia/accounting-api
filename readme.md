npm i -D typescript ts-node-dev

// add line in package.json
"scripts": {
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc -p ."
}

npm i express apollo-server-express dotenv graphql mongoose


--------- GRAPHQL ---------------

mutation
{
  createAccount(
    name:"Joshua", 
    description: "lorem ipsum") {
    id
    name
    description
  }


    mutation DeleteAccount {
        deleteAccount(id:"64ca71ac3df93728aa2c4792")
    }
}


query GetAllAccounts {
  getAllAccounts {
    id,
    name,
    description
  }
}