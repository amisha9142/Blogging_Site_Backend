const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,  
        required: true   // Place 'required' inside the field definition
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    tags: [{
        type: String
}],
    category: {
        type: String,
        required: true
    },
    subcategory: [{
        type: String
    }],
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // },
    deletedAt: {
        type: Date
        // default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;


