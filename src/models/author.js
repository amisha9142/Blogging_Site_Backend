const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        default: "user"
    }
},{timestamps:true});

// Ensure the unique constraint is applied properly
// authorSchema.path('email').index({ unique: true });

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
