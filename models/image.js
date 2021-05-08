let mongoose = require("mongoose");
//Setting Schema

let imageSchema = new mongoose.Schema({
    name:String,
    img:
        {
            data: Buffer,
            contentType: String
        },
    price:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectID,
            ref:"User"
        },
        username:String
    }
});



module.exports = mongoose.model("Image", imageSchema );