require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const {
    MongoClient
} = require('mongodb');

async function main() {
    // EXPRESS ROUTER KULLAN.

    app.use(cors());
    app.options('*', cors());
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri, {
        connectTimeoutMS: 10000,
        useNewUrlParser: true
    });
    await client.connect();
    const myDb = client.db('yediser');

    app.get('/standings', async (req, res) => {
        try {
            // Connect to the MongoDB cluster
            const items = await myDb.collection('standings').find({}).toArray();
            const playerList = items[0].playerList

            res.json(playerList);

            // close connection
            await client.close();
        } catch (e) {
            console.error("error", e);
        } finally {
            console.log("finally");
            await client.close();
        }
    });

    app.listen(3000, function () {
        console.log('listening on 3000')
    })

}

main().catch(console.error);