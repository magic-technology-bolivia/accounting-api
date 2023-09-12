npm i -D typescript ts-node-dev

// add line in package.json
"scripts": {
    "dev": "ts-node-dev src/index.ts",
    "build": "tsc -p ."
}

npm i express apollo-server-express dotenv graphql mongoose
------------------install for request dolibarr -------
npm i axios
npm i winston
npm i querystring
npm i lodash

--------- GRAPHQL ---------------

mutation
{
  createAccount(
      name:"ACTIVOS",
      code:{
        element:"1",
        group:"",
        account:"",
        subaccount:"",
        auxiliary:""
      } ) 
  {
      id
      parent_id
      name
      code{
        element,
        group,
        account,
        subaccount,
        auxiliary,
      }
  }
  createAccount(
      name:"ACTIVO CORRIENTE",
      code:{
        element:"1",
        group:"1",
        account:"",
        subaccount:"",
        auxiliary:""
      } ) 
  {
      id
      parent_id
      name
      code{
        element,
        group,
        account,
        subaccount,
        auxiliary,
      }
  }

}


mutation {
  deleteAccount(id:"64ca71ac3df93728aa2c4792")
}

mutation {

  createAccount(
      name:"CAJA MONEDA NACIONAL",
      parent_id: "64df01e9bd30b929626f0d3d",
      code:{
        element:"1",
        group:"1",
        account:"1",
        subaccount:"1",        
      } ) 
  {
      id
      parent_id
      name
      code{
        element,
        group,
        account,
        subaccount,
        auxiliary,
      }
  }

    updateAccount(id:"64e5114534a7a928c89c9e5a",
    account:{
      name:"CONTA",
      code: {
        element:"2",
        group:"2",
        account:"2",
        subaccount:"2",
        auxiliary:"2"
      },
      class:"D",
      currency:"USD",
      by_document:1,
      by_cost:1

    }
    ) 
    {
      code {
        element,
        group,
        account,
        subaccount
        auxiliary
      }
    }

}


query {
  getAllAccounts {
     id
     parent_id
     name
     code{
        element,
        group,
        account,
        subaccount,
        auxiliary,
      }
      class
      level
      currency
      by_document
      by_cost    
  }
}