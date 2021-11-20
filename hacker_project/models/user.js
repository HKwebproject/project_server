const mongoose = require('mongoose');

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
    // objectId 사용 고려
    id:{
        type: Number,
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
        default: 0      // 0: 미승인자, 1: 승인자, 2: 관리자
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

const User = mongoose.model('User', userSchema)

module.exports = { User }