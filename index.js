const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
const port = 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.19f5u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("se-creative-agency").collection("products");
    console.log("\n\nYeaahh Database Connected !!!!\n\n")
});


// console.log(process.env.DB_USER, process.env.DB_PASS)

app.get('/', (req, res) => {
    res.send('Listen form mongodb')
})

app.listen(port)