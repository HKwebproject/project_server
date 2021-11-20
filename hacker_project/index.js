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
    
        //2. db에 해당 이메일이 있다면 비밀번호가 같은지 확인
        //models/User.js 안에 해당 함수를 해줘야 함
        user.comparePassword(req.body.password, (err, isMatch) => {
          //(models/User.js 참고) 콜백함수의 파라미터로 결과가 전달되므로
          if (!isMatch) {
              //console.log(err)
            return res.json({
              loginSuccess: false,
              message: "비밀번호가 틀렸습니다",
            });
          }
          //3. 비밀번호까지 같다면 token을 생성
          //이것도 comparePassword 처럼 models/User.js에서 우리가 직접 메서드 만듦
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err); 
            res.cookie("h_auth", user.token)
              .status(200)
              .json({ loginSuccess: true, userId: user._id }); //x_auth라는 이름으로 토큰 값이 쿠키에 저장됨
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
         isAdmin: req.user.role === 0 ? false: true, // 3개
         isAuth : true,
         email: req.user.email,
         name: req.user.name,
         role: req.user.role,
     })
 })


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}}`);
});