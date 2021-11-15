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
    const reviewsCollection = database.collection('reviews');
    const usersCollection = database.collection('users');

    // GET scooters/ products
    app.get('/scooters', async (req, res) => {
        const cursor = scootersCollection.find({});
        const scooters = await cursor.toArray();
        res.send(scooters);
    });

    // GET scooter / product by ID
    app.get('/scooters/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const scooter = await scootersCollection.findOne(query);
      // console.log('Loading id: ', id);
      res.send(scooter);
    });
    
    // POST scooter / product
    app.post('/scooters', async (req, res) =>{
      const scooter = req.body;
      const result = await scootersCollection.insertOne(scooter);
      // console.log('order : ', order);
      res.json(result);
    });

    // PUT (Update) scooters
    app.put('/scooters/:id', async (req, res) => {
      const id = req.params.id;
      const updatedScooter = req.body;
      const filter = { _id: ObjectId(id) };
      const options = {upsert: true, filter: filter};
      const updateDoc = {
        $set: {
          name : updatedScooter.name,
          image : updatedScooter.image,
          price: updatedScooter.price,  
          description : updatedScooter.description, 

        }
      };
      const result = await scootersCollection.updateOne(filter, updateDoc, options); 
      // console.log('Updating: ', id);
      res.json(result);
    });

     // DELETE scooter
     app.delete('/scooters/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await scootersCollection.deleteOne(query);
      res.json(result);
      // console.log('One product deleted containing the ID: ', result);
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

    // GET reviews
    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // GET review by ID
    app.get('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = await reviewsCollection.findOne(query);
      // console.log('Loading id: ', id);
      res.send(review);
    });

    // POST reviews
    app.post('/reviews', async (req, res) => {
      const newReview = req.body;
      const result = await reviewsCollection.insertOne(newReview);
      res.json(result);
    });

    // PUT (Update) review
    app.put('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const updatedReview = req.body;
      const filter = { _id: ObjectId(id) };
      const options = {upsert: true, filter: filter};
      const updateDoc = {
        $set: {
          name: updatedReview.name, 
          email: updatedReview.email,  
          designation: updatedReview.designation,  
          review : updatedReview.review
        }
      };
      const result = await reviewsCollection.updateOne(filter, updateDoc, options); 
      // console.log('Updating: ', id);
      res.json(result);
    });

    // DELETE review
    app.delete('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.json(result);
    });

    // GET users
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // GET users
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email : email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({admin : isAdmin});
    });

    // POST users
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.json(result);
    });

    // PUT (Update) a user as admin
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = {email : user.email};
      const updateDoc = {$set : {role : 'admin'}};
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
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