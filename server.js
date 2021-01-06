var express = require('express')
var cors = require('cors')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')


// let dbURI = "mongodb+srv://zubairabc:zubairabc@cluster0.9qvbs.mongodb.net/testdatabase";
// let dbURI = 'mongodb://localhost:27017/abc-database';
let dbURI = "mongodb+srv://zubairabc:zubairabc@cluster0.j83vk.mongodb.net/testdatabase?retryWrites=true&w=majority"


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })





///////////************** Mongodb connected or disconnected Events ***********/////////////


mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected")

})

mongoose.connection.on('disconnectes', function () {
    console.log("mongoose is disconnected")
    process.exit(1)
})


mongoose.connection.on('error', function (err) {
    console.log('mongoose connecion is in error: ', err)
    process.exit(1)

})

mongoose.connection.on('SIGNIT', function () {
    console.log('app is turminating')
    mongoose.connection.close(function () {
        console.log('mongoose default connection is closed')
        process(0)
    })


})


///////////************** Mongodb connected or disconnected Events ***********/////////////


var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,

    createdOn: { type: Date, 'default': Date.now }


})

var userModle = mongoose.model("users", userSchema)

var app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())


app.post('/signup', (req, res, next) => {

    if (!req.body.userName
        || !req.body.userEmail
        || !req.body.userPhone
        || !req.body.userPassword) {
        res.status(403).send(`
        please send complete information
        e.g:
        {
            "name": "xyz",
            "email": "xyz@gmail.com",
            "password": "1234",
            "phone": "01312314",

        }`);
        return
    };

    userModle.findOne({ email: req.body.userEmail }, function (err, data) {
        if (err) {
            console.log(err)
        } else if (!data) {
            var newUaser = new userModle({
                "name": req.body.userName,
                "email": req.body.userEmail,
                "password": req.body.userPhone,
                "phone": req.body.userPassword,
            });

            newUaser.save((err, data) => {
                if (!err) {
                    res.status(200).send({
                        message: "User created"
                    })
                } else {
                    console.log(err)
                    res.status(403).send({
                        message: "SignUP field"
                    })
                };

            });

        } else {

           res.status(403).send({
               message:"ueerer nasi llfl"
           })
        }
    })




});


app.post("/login", (req, res, next) => {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    console.log(userEmail)
    console.log(userPassword)



    userModle.findOne({ email: userEmail, password: userPassword }, function (err, data) {

        if (err) {
            console.log(err)
        } else if (data) {
            res.send({
                message: "login success",
                status: 200
            })

        } else {
            res.send({
                message: "User not found",
                status: 403

            })

        }

    })

})

// app.post("/login", (req, res, next) => {


//     // res.send(JSON.stringify(req.body));
//     var userEmail = req.body.userEmail;
//     var userPassword = req.body.userPassword;
//     // console.log(req.body.email)
//     // console.log(req.body.password)
//     // console.log(req.body);

//     userModle.findOne({ email: userEmail, password: userPassword }), function (err, data) {

//         if (err) {
//             console.log(err)
//             } else if (data) {

//             res.send({
//                 message: "login success",
//                 status: 200
//             })

//             } else {
//             res.send({
//                 message: "User not found",
//                 status: 403

//             })
//         }
//     })



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("surver is running on : ", PORT)
});







