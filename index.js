const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 5000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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



        app.get('/tasks/item/:id', async (request, response) => {
            const id = request.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.findOne(query);
            response.status(200).send(result);
          });
      
          app.get('/ongoing', async (request, response) => {
            const result = await taskCollection.find({ status: 'ongoing' }).toArray();
            response.status(200).send(result);
          });
      
          app.get('/created', async (request, response) => {
            const result = await taskCollection.find({ status: 'created' }).toArray();
            response.status(200).send(result);
          });
      
          app.get('/completed', async (request, response) => {
            const result = await taskCollection
              .find({ status: 'completed' })
              .toArray();
            response.status(200).send(result);
          });



        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });


        app.get('/tasks/:loggedInUserEmail', async (req, res) => {
            const loggedInUserEmail = req.params.loggedInUserEmail;
            const query = { loggedInUserEmail: loggedInUserEmail }
            const result = await taskCollection.find(query).toArray()
            res.send(result)
        })


            // * !patch method
                // * /

        app.patch('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: { status: req.body.status },
            };
            const result = await taskCollection.updateOne(query, updatedDoc);
            res.send(result);
        });

        /**
         * ! delete method
         */

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
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