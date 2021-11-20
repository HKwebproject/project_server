const express = require("express");
const { User } = require("./models/User");
const app=express();


const config = require("./config/key");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const port=4000;

app.use(express.urlencoded({extended: true})); //데이터 분석
app.use(express.json()) //json형태로 변환



const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.post("/register", (req, res) => {
    const user = new User(req.body);
    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({
        success: true,
      });
    });
  });

app.get("/",(req,res)=>{
    res.send("Hello World!");
});

app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}}`);
});