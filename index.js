const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.19f5u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db("se-creative-agency").collection("products");
    const reviewsCollection = client.db("se-creative-agency").collection("review");
    const orderCollection = client.db("se-creative-agency").collection("orders");

    // ================ Add a single product to the collection =================
    app.post("/addProdcuct", (req, res) => {
        const product = req.body;
        productsCollection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    // ================= Load all products =================
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // =============== Load a single product using key =================
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);//load only one item
            })
    })

    // =============== Load a multiple product using key =================
    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productsCollection.find({ key: { $in: productsKeys } })//load miltiple data using keys(in method)
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // ================ Add a review to the collection =================
    app.post("/addReview", (req, res) => {
        const review = req.body;
        reviewsCollection.insertOne(review)
            .then(result => {
                res.send(result)
            })
    })

    // ================= Load all Review Using key in perticuler product =================
    app.get('/allReview/', (req, res) => {
        reviewsCollection.find({ key: req.query.key })
            .toArray((err, documents) => {
                res.send(documents);//load item
            })
    })

    // ================= Load all Review in admin panle= =================
    app.get('/allReviewInAdmin/', (req, res) => {
        reviewsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);//load item
            })
    })

    // ================ Add a order to the order collection =================
    app.post("/addOrder", (req, res) => {
        const order = req.body;
        // console.log(order)
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result)
            })
    })

    // ================= Load all Order Using email in =================
    app.get('/clientOrder/', (req, res) => {
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);//load item
            })
    })

    // ================= Load all Order for admin panel =================
    app.get('/clientAllOrder', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);//load item
            })
    })


});



console.log("\n\nYeaahh Database Connected !!!!\n\n")
app.get('/', (req, res) => {
    res.send('Listen form mongodb')
})

app.listen(port)