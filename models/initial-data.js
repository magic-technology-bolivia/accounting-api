// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test');

// Create a new document in the collection.
db.getCollection('accounts').insertMany([
   {
    "code": 1,
    "name": "ACTIVO",
    "description": "lorem ipsum",
    
  },
  {
    "code": 2,
    "name": "PASIVO",
    "description": "lorem ipsum",
    
  },
  {
    "code": 3,
    "name": "PATRIMONIO",
    "description": "lorem ipsum",
    
  },
  {
    "code": 4,
    "name": "INGRESOS",
    "description": "lorem ipsum",
    
  },
  {
    "code": 5,
    "name": "COSTOS",
    "description": "lorem ipsum",
    
  },
  {
    "code": 6,
    "name": "GASTOS",
    "description": "lorem ipsum",
    
  },
  {
    "code": 11,
    "name": "ACTIVO CORRIENTE",
    "description": "lorem ipsum",
    
  },
  {
    "code": 111,
    "name": "ACTIVO DISPONIBLE",
    "description": "lorem ipsum",
    
  },
  {
    "code": 1111,
    "name": "CAJA MONEDA NACIONAL",
    "description": "lorem ipsum",
    
  },
]);
