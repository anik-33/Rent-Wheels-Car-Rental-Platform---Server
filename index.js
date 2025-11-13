const express = require('express')
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000


app.use(cors());
app.use(express.json());

// dU86G1UY6Q9t6ycD
// car-wheels-db


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjfssbu.mongodb.net/?appName=Cluster0`;

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
        await client.connect();

        const db = client.db('cars-db')
        const carCollection = db.collection('cars')
        const testimonial = db.collection('testimonial')
        const bookCollection= db.collection('bookings')
        // get method
        app.get('/allcar', async (req, res) => {

            const result = await carCollection.find().toArray()

            res.send(result)

        })
        // get method for testimonial
        app.get('/testimonial', async (req, res) => {

            const result = await testimonial.find().toArray()

            res.send(result)

        })
        // get method for bookings
        app.get('/car/bookings', async (req, res) => {

            const result = await bookCollection.find().toArray()

            res.send(result)

        })

        // post method
        app.post("/allcar", async (req, res) => {
            const data = req.body;
            const result = await carCollection.insertOne(data);
            res.send(result)
        })
        // post method
        app.post("/car/bookings", async (req, res) => {
            const data = req.body;
            const result = await bookCollection.insertOne(data);
            res.send(result)
        })


    // find single car
     app.get("/car/:id",  async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);

      const result = await carCollection.findOne({ _id: objectId });

      res.send({
        success: true,
        result,
      });
    });




        // latest 6 data
        app.get("/latest-cars", async (req, res) => {
            const result = await carCollection
                .find()
                .sort({ CreatedAt: "desc" })
                .limit(6)
                .toArray();

            console.log(result);

            res.send(result);
        });

        // search car api
        app.get("/search", async (req, res) => {
            const search_text = req.query.search
            const result = await carCollection.find({ CarName: { $regex: search_text, $options: "i" } }).toArray()
            res.send(result)
        });

        // My Listing api ,find data through your email

        app.get("/my-listing", async (req, res) => {
            const email = req.query.email
            const result = await carCollection.find({ ProviderEmail: email }).toArray()
            res.send(result)
        })
        // get method for find my booking
        app.get("/car/mybooking", async (req, res) => {
            const email = req.query.email
            const result = await bookCollection.find({ BookEmail: email }).toArray()
            res.send(result)
        })

    //PUT APIS

    app.put("/car/:id",  async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      // console.log(id)
      // console.log(data)
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };

      const result = await carCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });

    // Patch api
    app.patch('/car/:id', async(req,res)=>{
        const id = req.params.id;
        const {Status} =req.body;
        const query = {_id: new ObjectId(id)}
        const update = {
            $set:{
                Status:Status,
            }
        }
        const options ={}
        const result = await carCollection.updateOne(query,update,options)

         res.send({
        success: true,
        result,
      });
    })

    // delete


    app.delete("/car/:id",  async (req, res) => {
      const { id } = req.params;
      
      const result = await carCollection.deleteOne({ _id: new ObjectId(id) });

      res.send({
        success: true,
        result,
      });
    });


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
