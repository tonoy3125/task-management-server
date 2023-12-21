const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 5000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3il8g6r.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        const taskCollection = client.db('taskDB').collection('tasks')



        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









// Initial Server Running
app.get('/', (req, res) => {
    res.send('Task Management is running')
})
app.listen(port, () => {
    console.log(`Task Management sitting on the port ${port}`)
})