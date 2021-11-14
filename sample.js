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

    const database = client.db('tourverse');
    const resortCollection = database.collection('resorts');
    const bookingCollection = database.collection('booking');

    // GET resorts
    app.get('/resorts', async (req, res) => {
        const cursor = resortCollection.find({});
        const resorts = await cursor.toArray();
        res.send(resorts);
    });
    
    // Get single resort
    app.get('/resorts/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const resort = await resortCollection.findOne(query);
        // console.log('Loading id: ', id);
        res.send(resort);
    });

    // POST resorts
    app.post('/resorts', async (req, res) => {
      const newResort = req.body;
      const result = await resortCollection.insertOne(newResort);
      res.json(result);
    });


    // PUT (Update) resorts
    app.put('/resorts/:id', async (req, res) => {
      const id = req.params.id;
      const updatedResort = req.body;
      const filter = { _id: ObjectId(id) };
      const options = {upsert: true, filter: filter};
      const updateDoc = {
        $set: {
          name : updatedResort.name,
          image : updatedResort.image,
          location : updatedResort.location,
          price: updatedResort.price,  
          description : updatedResort.description, 

        }
      };
      const result = await resortCollection.updateOne(filter, updateDoc, options); 
      // console.log('Updating: ', id);
      res.send(result);
    });

    // DELETE resorts
    app.delete('/resorts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await resortCollection.deleteOne(query);
      res.json(result);
      // console.log('One resort deleted containing the ID: ', result);
    });

    // GET All Bookings
    app.get('/bookings', async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // GET Booking by ID
    app.get('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.findOne(query);
      // console.log('Loading id: ', id);
      res.json(booking);
    });

    // POST Booking 
    app.post('/bookings', async (req, res) =>{
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      // console.log('booking : ', booking);
      res.json(result);
    });

    // DELETE booking
    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });
    
  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tourverse server started');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});