const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();
const port = process.env.PORT || 7000;
const app = express();


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@testdb.lsfn3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const database = client.db('scootymatic');
    const scootersCollection = database.collection('scooters');
    const ordersCollection = database.collection('orders');

    // GET scooters
    app.get('/scooters', async (req, res) => {
        const cursor = scootersCollection.find({});
        const scooters = await cursor.toArray();
        res.send(scooters);
    });

    // GET scooter by ID
    app.get('/scooters/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const scooter = await scootersCollection.findOne(query);
      // console.log('Loading id: ', id);
      res.send(scooter);

    });


    // GET All orders
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // GET order by ID
    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await ordersCollection.findOne(query);
      // console.log('Loading id: ', id);
      res.json(order);
    });

    // POST order 
    app.post('/orders', async (req, res) =>{
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      // console.log('order : ', order);
      res.json(result);
    });
    // DELETE order
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });
    
  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Scootymatic database connected')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})