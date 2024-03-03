const Blog = require("../models/blog");
const Author = require("../models/author");
const { isValidObjectId } = require("mongoose");

exports.createBlog = async(req,res)=>{
    try{
        const{title,body,authorId,category,tags,subcategory,isPublished} = req.body

        if(!authorId){
            return res.status(400).json({status:false,message:"authorId is missing"})
        }
        if(!isValidObjectId(authorId)){
            return res.status(400).json({status:false,message:"authorId is invalid"})
        }
        const isValidAuthorId = await Author.findOne({_id:authorId})
        if(!isValidAuthorId){
            return res.status(400).json({status:false,message:"authorId not exist."})
        }

        if(!title){
            return res.status(400).json({status:false,message:"title is required"})
        }
        
        if(!body){
            return res.status(400).json({status:false,message:"body is required"})
        }

        if(!category){
            return res.status(400).json({status:false,message:"category is required"})
        }

        const blogCreate = await Blog.create({
            title,
            body,
            authorId,
            category,
            tags,
            subcategory,
            isPublished
        })
        return res.status(201).json({status:true,message:"blog created successfully",data:blogCreate})

    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({status:false,message:"internal server error"})
    }
}


// get blog by filter
exports.getBlog = async(req,res)=> {
    try{
        const{authorId,category,tags,subcategory} = req.query;
        const filter = {isDeleted:false,isPublished:true}  // condition 

        if(authorId){
            filter.authorId = authorId
        }

        if(category){
            filter.category = category
        }

        if(tags){
            filter.tags = tags
        }

        if(subcategory){
            filter.subcategory = subcategory
        }
        const filterData = await Blog.find(filter)
        .populate("authorId")   // authorid k data ko concatnate kr dega is wale filterData wale variable m .
        return res.status(200).json({status:true,message:"data filtered successfully" , data:filterData})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}

// get data without filter
// exports.getBlog = async(req,res)=> {
//     try{
//         const{authorId} = req.body;
//         const blogGet = await Blog.findOne({
//             authorId,
//             isDeleted : false,
//             isPublished : true
//         }).populate("authorId")
//         return res.status(200).json({status:true,message:"blog data fetched successfully",data:blogGet})
//     }
//     catch(error){
//         console.log(error.message)
//         return res.status(500).json({status:false,message:"internal server error"})
//     }
// }

// update blog
exports.updateBlog = async (req, res) => {
    try {
      const { blogId } = req.params;
      const { title, body, tags, subcategory, published } = req.body;
  
      const existingBlogData = await Blog.findOne({ _id: blogId ,isDeleted:false});
  
      if (!existingBlogData) {
        return res.status(404).json({ status: false, message: "Blog not found" });
      }
  
      existingBlogData.title = title || existingBlogData.title;
      existingBlogData.body = body || existingBlogData.body;
      existingBlogData.tags = tags || existingBlogData.tags;
      existingBlogData.subcategory = subcategory || existingBlogData.subcategory;
  
      if (published) {
        existingBlogData.isPublished = true;
        existingBlogData.publishedAt = new Date(); // Use new Date() to get the current timestamp
      } else {
        existingBlogData.isPublished = false;
        existingBlogData.publishedAt = null;
      }
  
      const savedData = await existingBlogData.save();
  
      return res.status(200).json({
        status: true,
        message: "Data updated successfully",
        data: savedData,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ status: false, message: "Internal server error" });
    }
  };
  

// delete blog
exports.deleteBlog = async(req,res)=>{
    try{
        const{blogId} = req.params;
        const existingBlogId = await Blog.findOne({ _id: blogId ,isDeleted:false});
        if(!existingBlogId){
            return res.status(404).json({status:false,message:"blog id not exist or already deleted"})
        }

        existingBlogId.isDeleted = true;
        await existingBlogId.save();

        return res.status(200).json({status:true,message:"blog deleted successfully"})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}


// delete document by filter
exports.deleteBlogDocument = async(req,res)=>{
    try{
        const{category,authorId,tags,subcategory,unpublished} = req.query;
        const query = {}
        if(category){
            query.category = category;
        }
        if(authorId){
            query.authorId = authorId;
        }
        if(tags){
            query.tags = tags;
        }
        if(subcategory){
            query.subcategory = subcategory;
        }
        if(unpublished === true){
            query.isPublished = false;
        }

        const deleteDocument = await Blog.deleteOne(query);
// hm jo data delete krna chahte h agr vo exist hi ni krta h blog m to ye message dega.
        if (deleteDocument.deletedCount === 0) {   // deletedCount m vo value aata h 
// means kitna data delete ho rha h 1 , 2 , 3 kitna number . 
            return res.status(404).json({
              status: false,
              message: 'No matching document found for deletion.',
            });
          }

        return res.status(200).json({status:true,message:"document deleted successfully" , data:deleteDocument})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}

