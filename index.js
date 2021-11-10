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

    // GET scooters
    app.get('/scooters', async (req, res) => {
        const cursor = scootersCollection.find({});
        const scooters = await cursor.toArray();
        res.send(scooters);
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