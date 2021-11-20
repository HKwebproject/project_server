const mongoose=require("mongoose");

const commentSchema=mongoose.Schema({
    id:{
        type:number,
        unique:1,
        required:true
    },
    title:{
        type:string,
        require:true
    },
    content:{
        type:string
    },
    writer:{
        //user.js에서 user.id값 참조해야 함
        ref : 'User'
    },
    date:{
        type:Date,
        required:true
    },
    like:{
        type:number,
        required:true
    },
    views:{
        type:number,
        required:true
    },
    category:{
        type:string,
    },
    is_highlight:{
        type:Boolean,
        default:false
    }
})