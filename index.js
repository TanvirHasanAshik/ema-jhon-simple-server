const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brhhmac.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const productCollection = client.db('emaJhon').collection('product');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const product = productCollection.find(query).skip(page * size).limit(size);
            const result = await product.toArray();
            res.send(result);
        });

        app.get('/productCount', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const productCount = await cursor.count();

            res.send({ productCount });
        })
    } finally {
        // client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Welcome to ema-jhon simple');
})

app.listen(port, () => {
    console.log('listening on port', port);
})