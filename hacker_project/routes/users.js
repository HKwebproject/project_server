const express = require('express')
const router = express.Router() // express의 Router 기능 사용
const { User } = require("../models/user")
const { auth } = require("../middleware/auth")

router.get('/auth', auth ,(req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 2 ? true: false, // 0: 방문객, 1: 동아리원(승인ㅇ), 2: 관리자
        isAuth : true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        // image: req.user.image
    })
})

router.post("/register", (req, res) => {
    const user = new User(req.body); 
    user.save((err, userInfo) => {
      if (err) return res.json({ success: false, err });
      //에러 없이 성공적으로 저장했다면
      return res.status(200).json({
        success: true,
      });
    });
});

router.post("/login", (req, res) => {
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


router.get('/logout', auth, (req, res) => {
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

module.exports = router;