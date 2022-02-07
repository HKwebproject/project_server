const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    id : {
        type: Schema.Types.ObjectId,
        unique: 1,
        required : true
    },
    title : {
        type: String,
        maxlength: 100,
        required : true
    },
    content : {
        type: String,
        required : true
    },
    writer : {
        type: String,
        ref : 'User'
    },
    date : {
        type : Date,
        default : Date.now
    },
    like : {
        type : Number
    },
    views : {
        type: Number
    },
    category : {
        type : String
    },
    is_highlight : {
        type : Boolean,
        default : false
    }
})

const Post = mongoose.model('Post', postSchema);



module.exports = { Post }