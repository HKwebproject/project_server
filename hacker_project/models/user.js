const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const imageSchema = new mongoose.Schema({
    width: Number,
    height: Number,
});

const userSchema = mongoose.Schema({
    name:{ 
        type: String,
        maxlength: 10,
        required: true
    },
    email:{
        type: String,
        trim: true,
        unique: 1,
        required: true
    },
    // ObjectId 사용 고려
    id:{
        type: String,
        trim: true,
        unique: 1,
        required: true
    },
    password:{
        type: String,
        trim: true,
        minlength: 4,
        required: true
    },
    role:{
        type: Number,
        default: 0           // 0: 미승인자, 1: 승인자, 2: 관리자
    },
    birth:{
        type: Date,
        default: Date.now
    },
    image: imageSchema,      // 필수 X, 프론트랑 상의 필요
    token:{
        type: String
    },
    toeknExp:{
        type: Number
    }

})


userSchema.pre("save", function(next) {
    let user = this;
    if(user.isModified("password")){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next();
            })
        })
    } else{
        next();
    }
})


userSchema.methods.comparePassword = function (myPlainPassword, cb) {
    bcrypt.compare(myPlainPassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
	let user = this;
	let token = jwt.sign(user._id.toHexString(), "secretToken");
	user.token = token;
	user.save(function (err, user) {
	if (err) return cb(err);
	cb(null, user);
	});
};


userSchema.statics.findByToken = function ( token, cb ) {
    let user = this;

    jwt.verify(token, 'secretToken', function(err, decoded) {
        user.findOne({ "_id" : decoded, "token": token }, function(err, user){

            if(err) return cb(err);
            cb(null, user)

        })
    })
}


const User = mongoose.model('User', userSchema)

module.exports = { User }