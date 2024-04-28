const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.dmwxvyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const tourismApp = client.db("tourismApp");
    const allSpot = tourismApp.collection("allSpot");
    const countryData = tourismApp.collection("countryData");

    app.get("/allspot", async (req, res) => {
      const data = allSpot.find();
      const result = await data.toArray();
      res.send(result);
    });

    app.post("/allspot", async (req, res) => {
      const spotInfo = req.body;
      const result = await allSpot.insertOne(spotInfo);
      res.send(result);
    });

    app.get("/allspot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allSpot.findOne(query);
      res.send(result);
    });

    // get all data to specific country
    app.get("/specificCountry/:name", async (req, res) => {
      const query = { country: req.params.name };
      const cursor = allSpot.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get all country data for home page
    app.get("/countryData", async (req, res) => {
      const cursor = countryData.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data via userEmail
    app.get("/allDataByEmail/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const cursor = allSpot.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
