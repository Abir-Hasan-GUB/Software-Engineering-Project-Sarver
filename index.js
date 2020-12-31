const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ObjectId = require('mongodb').ObjectID;
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
    const adminCollection = client.db("se-creative-agency").collection("admin");

    // ================ Add a single product to the collection =================
    app.post("/addProdcuct", (req, res) => {
        const product = req.body;
        // console.log(product);
        productsCollection.insertOne(product)
            .then(result => {
                res.send(result)
            })
    })

    // ================= Search into all products =================
    app.get('/products', (req, res) => {
        const search = req.query.search; // recive search parameters
        productsCollection.find({ name: { $regex: search, $options: "$i" } })//search with case insensative
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // ================= Load all products =================
    app.get('/Allproducts', (req, res) => {
        productsCollection.find({})//search with case insensative
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
        // console.log(req.body.date)
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

    // ================= Delete an Review from admin panel =================
    app.delete('/deleteOneReview/:id', (req, res) => {
        reviewsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(results => {
                res.send(results);
            })
    })
    // ================= Delete an order by user =================
    app.delete('/deleteOneOrder/:id', (req, res) => {
        orderCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(results => {
                res.send(results);
            })
    })
    // ================= Delete an Product by Admin =================
    app.delete('/deleteOneProduct/:id', (req, res) => {
        productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(results => {
                // console.log(results);
                res.send(results);
            })
    })

    // ================= Update an status by admin =================
    app.patch('/updateStatus/:id', (req, res) => {
        orderCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { status: req.body.updateStatus }
            })
            .then(results => {
                res.send(results)
            })
    });

    // ================= Update an status by admin =================
    app.patch('/updateProductInformation/:id', (req, res) => {
        productsCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.newPrice, stock: req.body.newStock }
            })
            .then(results => {
                // console.log(results)
                res.send(results)
            })
    });

    // ================= display date wise order and sell =================
    app.post('/orderByDate', (req, res) => {
        const { curentDate } = req.body;
        //   console.log(curentDate);
        orderCollection.find({ date: curentDate }) // find using date
            .toArray((err, documents) => {
                //   console.log(documents)
                res.send(documents)
            })
    });


    // ================ Make admin to admin collection =================
    app.post("/makeAdmin", (req, res) => {
        const admin = req.body;
        // console.log(admin)
        // console.log(req.body.date)
        adminCollection.insertOne(admin)
            .then(result => {
                res.send(result)
            })
    })

    // ================= Find Admin Using email for login verification =================
    app.get('/findAdmin/', (req, res) => {
        adminCollection.find({ role: req.query.role })
            .toArray((err, documents) => {
                res.send(documents);//load item
            })
    })


});

// console.log("\n\nYeaahh Database Connected !!!!\n\n")
app.get('/', (req, res) => {
    res.send('Listen form mongodb')
})

app.listen(process.env.PORT || port)