const express = require("express");
const app=express();
const port=4000;
const path = require('path');
const { User } = require("./models/user");
const config = require("./config/key");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require('./middleware/auth');
const cors = require('cors');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// mongoose 기능 require
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

// user router 받아오기
const users = require('./routes/users');
app.use('/users', users);


app.get("/",(req,res)=>{
    res.send("Hello World!");
});


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}}`);
});``