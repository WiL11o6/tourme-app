const express = require('express');
const app = express();
const path = require("path");
const db = require('./js/database');
const routes = require('./routes/index');
const session = require("express-session");
const mysqlSession = require('express-mysql-session')(session);
const bcrypt = require('bcrypt');
// const flash = require('connect-flash')

const mysqlSessionStore = new mysqlSession({/*using default*/}, db);

app.use(
    session({
        key: "cookieid",
        secret: "hello this is my secret",
        store: mysqlSessionStore,
        resave: false,
        saveUninitialized: false
    })
);

// app.use(flash())

// Makes sure we can grab data from any form
app.use(express.urlencoded({ extended: false}));
// Parse JSON bodies
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/', routes);
app.use('/auth', require('./routes/auth'));
app.use('/index', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/tourGuide', require('./routes/tourguide'));


/* ------------------Payment Back-End------------------- */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path: '.env'});
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretKey, stripePublicKey)

const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/availablePackages', function(req, res) {
    fs.readFile('items.json', function(error, data){
        if(error) {
            res.status(500).end()
        } else {
            res.render('availablePackages.ejs', {
                stripePublicKey: stripePublicKey, 
                items: JSON.parse(data)
            })
        }
    })
})

app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data){
        if(error) {
            res.status(500).end()
        } else {
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.package1.concat(itemsJson.package2)
            let total = 0
            req.body.items.forEach(function(item) {
                const itemJson = itemsArray.find(function(i) {
                    return i.id == item.id
                })
                total = total + (itemJson.price * item.quantity)
            })
            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(function() {
                console.log('Charge Successful')
                res.json({message: 'Successfully purchased items'})
            }).catch(function() {
                console.log('Charge Fail')
                res.status(500).end()
            })
        }
    })
})


app.listen(8080, () => {
    console.log("Server is up");
});

/* ----------------------------------------------- */