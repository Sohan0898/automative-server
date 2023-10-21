const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId, } = require('mongodb');
require("dotenv").config();

const app = express();
const ports = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());
  

 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8p2aqm7.mongodb.net/?retryWrites=true&w=majority`;

 
 // Create a MongoClient with a MongoClientOptions object to set the Stable API version
 const client = new MongoClient(uri, {
   serverApi: {
     version: ServerApiVersion.v1,
     strict: true,
     deprecationErrors: true,
   }
 });
 
 async function run() {
   try {
     // Connect the client to the server	(optional starting in v4.7)
    const productCollection = client.db('ProductsDB').collection('products');
    const brandCollection = client.db('ProductsDB').collection('brands');
    const mycartCollection = client.db('ProductsDB').collection('myCart');
    
    app.get('/myCart/:email', async (req, res) => {
        
      const email = req.params.email; 
      const query = { email: email};
      const result= await mycartCollection.find(query).toArray();
      console.log(result);
      res.send(result)

          
    });

    app.get('/myCart', async (req, res)=>{
      const cursor =mycartCollection.find();
      const result= await  cursor.toArray();
      res.send(result);
  })

    app.get('/products/brand/:id', async (req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    
    app.get('/products/:brand', async (req, res) => {
        
        const brand = req.params.brand; 
        const query = { brand: brand};
        const result= await productCollection.find(query).toArray();
        console.log(result);
        res.send(result)

            
      });

    app.get('/brands', async (req, res)=>{
        const cursor =brandCollection.find();
        const result= await  cursor.toArray();
        res.send(result);
    })

    app.get('/products', async (req, res)=>{
        const cursor =productCollection.find();
        const result= await  cursor.toArray();
        res.send(result);
    })
    
    app.post('/products', async (req, res)=>{
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    });

    app.post('/myCart', async (req, res)=>{
      const newCart = req.body;
      console.log(newCart);
      const result = await mycartCollection.insertOne(newCart);
      res.send(result);
  });


    app.put('/products/brand/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert : true}
         const updateProduct = req.body;
        const product={
          $set: {
            name : updateProduct.name,
            brand : updateProduct.brand,
            type : updateProduct.type,
            price : updateProduct.price,
            image : updateProduct.image,
            rating : updateProduct.rating,
            
          }
        }
        const result = await productCollection.updateOne(filter, product, options);
        res.send(result);
      })

      app.delete('/myCart/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await mycartCollection.deleteOne(query);
        res.send(result);
 
     })


     await client.connect();
     // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
     // Ensures that the client will close when you finish/error
    //  await client.close();
   }
 }
 run().catch(console.dir);
 

 // routes

 app.get('/', (req, res) => {
    res.send('Automative Server Started');
 });

 app.listen(ports, () => {
    console.log(`Automative server running on port ${ports}`);
 });


 

