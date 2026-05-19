const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const port = process.env.PORT
const uri = process.env.MONGODB_URL
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();
    const db = client.db('MediQueue')
    const tutorsCollection = db.collection('MediQueue_Data')
    const bookingCollection = db.collection('MediQueue_booking')


    app.get('/tutors', async(req, res)=>{
      const result = await tutorsCollection.find().toArray()
      res.send(result)
    })
    app.get('/tutors/:id', async(req, res)=>{
      const {id} = req.params;
      const result = await tutorsCollection.findOne({_id: new ObjectId(id)})
      res.send(result);
    })
    app.post('/tutors', async(req, res)=>{
      const newData = req.body;
      console.log(newData)
      const result= await tutorsCollection.insertOne(newData)
      res.send(result)
    })
    app.delete('/tutors/:id', async(req, res)=>{
      const {id} = req.params;
      const result = await tutorsCollection.deleteOne({_id: new ObjectId(id)})
      res.send(result)

    })
    app.patch('/tutors/:id', async(req, res)=>{
      const {id} = req.params;
      const newData = req.body;
      const result = await tutorsCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: newData}
      )
      res.send(result)
    })



    app.get('/booking', async(req, res)=>{
      const result = await bookingCollection.find().toArray()
      res.send(result)
    })

    app.get('/booking/:id', async(req, res)=>{
      const {id} = req.params;
      const result = await bookingCollection.findOne({_id: new ObjectId(id)})
      res.send(result)
    })

    app.delete('/booking/:id', async(req, res)=>{
      const {id} = req.params;
      const result = await bookingCollection.deleteOne({_id: new ObjectId(id)})
      res.send(result)
    })

    app.post('/booking', async(req, res)=>{
      const newData = req.body;
      const result = await bookingCollection.insertOne(newData)
      res.send(result)
    })


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})