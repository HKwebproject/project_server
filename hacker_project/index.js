const express = require("express");
const app=express();
const port=4000;
const { User } = require("./models/user");
const config = require("./config/key");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require('./middleware/auth')

app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cookieParser());


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.post("/register", (req, res) => {
    const user = new User(req.body); 
    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err });
      //에러 없이 성공적으로 저장했다면
      return res.status(200).json({
        success: true,
      });
    });
});

app.post("/login", (req, res) => {
        User.findOne({ id: req.body.id}, (err, user) => {
            if (!user) {
            return res.json({
                success: false,
                message: "입력된 학번에 해당되는 유저가 없습니다",
            });
        }
    
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (!isMatch) {
            return res.json({
              loginSuccess: false,
              message: "비밀번호가 틀렸습니다",
            });
          }
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err); 
            res.cookie("h_auth", user.token)
              .status(200)
              .json({ loginSuccess: true, userId: user._id }); 
          });
        });
      });
    });

      
app.get("/",(req,res)=>{
    res.send("Hello World!");
});

app.get('/auth', auth ,(req, res) => {
     res.status(200).json({
         _id: req.user._id,
         isAdmin: req.user.role === 2 ? true: false, // 3개 수정필요.
         isAuth : true,
         email: req.user.email,
         name: req.user.name,
         role: req.user.role,
        // image: req.user.image
     })
 })

 app.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id},
        { token: "" },
        (err, user) => {
            if(err){
              console.log(err);
              return res.json({success:false, err});
            } 
            return res.status(200).send({
                success: true
            })
        })
})


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}}`);
});