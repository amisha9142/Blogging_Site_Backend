const jwt = require("jsonwebtoken");
const Author = require("../models/author");

exports.isAuthenticated = async(req,res,next)=>{
    const token = req.headers["x-api-key"]

    if(!token){
        return res.status(400).json({status:false,message:"token is required"})
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decodedData)
    console.log(decodedData.authorId)

    req.author = await Author.findById(decodedData.authorId)
    console.log(req.author)

    next();
}

// authorization
exports.authorizeRoles = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes (req.author.role)){
            return res.status(400).json({
                status:false,
                messsage: `${req.author.role} is not allowed to edit or delete blogs.`
            })
        }
        next();
    }
}

