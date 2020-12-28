const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.19f5u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db("se-creative-agency").collection("products");
    const reviewsCollection = client.db("se-creative-agency").collection("review");

    // ================ Add a single product to the collection =================
    app.post("/addProdcuct", (req, res) => {
        const product = req.body;
        productsCollection.insertOne(product)
        .then(result =>{
            console.log(result.insertedCount)
            res.send(result.insertedCount)
        })
    })

    // ================= Load all products =================
    app.get('/products',(req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    // =============== Load a single product using key =================
    app.get('/product/:key',(req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);//load only one item
        })
    })

 // =============== Load a multiple product using key =================
app.post('/productsByKeys', (req, res) => {
    const productsKeys = req.body;
    productsCollection.find({key: {$in: productsKeys}})//load miltiple data using keys(in method)
    .toArray((err, documents) => {
        res.send(documents)
    })
})

// ================ Add a review to the collection =================
app.post("/addReview", (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review)
    .then(result =>{
        res.send(result.insertedCount)
    })
})

// ================= Load all Review Using key in perticuler product =================
app.get('/allReview/',(req, res) => {
    reviewsCollection.find({key: req.query.key})
    .toArray((err, documents) => {
        console.log(documents)
        res.send(documents);//load only one item
    })
})







});



console.log("\n\nYeaahh Database Connected !!!!\n\n")
app.get('/', (req, res) => {
    res.send('Listen form mongodb')
})

app.listen(port)