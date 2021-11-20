const { User } = require("../models/user");

let auth = (req, res, next) => {
    let token = req.cookies.h_auth;
    // 토큰을 복호화 한 후 유저 find
    User.findByToken(token, (err,user) => {
        if (err) throw err;
        if(!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = { auth }