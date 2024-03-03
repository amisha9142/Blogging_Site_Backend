const Author = require("../models/author");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validatePassword, validateEmail, validateName } = require("../utilis/validation");

exports.createAuthor = async(req,res)=>{
    try{
        const{fname,lname,title,email,password,role} = req.body;

// fname validation
        if(!fname){
            return res.status(400).json({status:false,message:"fname is required"})
        }
        if(!validateName(fname)){
            return res.status(400).json({status:false,message:"fname is invalid"})
        }

// lname validation
        if(!lname){
            return res.status(400).json({status:false,message:"lname is required"})
        }
        if(!validateName(lname)){
            return res.status(400).json({status:false,message:"lname is invalid"})
        }

// email validation
        if(!email){
            return res.status(400).json({status:false,message:"email is required"})
        }
        if(!validateEmail(email)){
            return res.status(400).json({status:false,message:"email is invalid"})
        }

// if email is already exist 
        const existingEmail = await Author.findOne({
            email : email  // email 
        })
        if(existingEmail){
            return res.status(400).json({status:false,message:"email already exist"})
        }

        //password validation
        if(!password){
            return res.status(400).json({status:false,message:"password is required"})
        }
        if(!validatePassword(password)){
            return res.status(400).json({status:false,message:"password is invalid"})
        }
        // convert password in bcrypt form
        const bcryptPassword = await bcrypt.hash(password,10)

        const authorCreate = await Author.create({
            fname,
            lname,
            title,
            email,
            password:bcryptPassword,
            role
        })
        return res.status(200).json({status:true,message:"author created successfully",data:authorCreate})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}


// ### POST /login
// - Allow an author to login with their email and password. On a successful login attempt return a JWT token contatining the authorId in response body like [this](#Successful-login-Response-structure)
// - If the credentials are incorrect return a suitable error message with a valid HTTP status code

exports.login = async(req,res)=>{
    try{
        const{email,password} = req.body;
        if(!email){
            return res.status(404).json({status:false,message:"email is required"})
        }
        if(!validateEmail(email)){
            return res.status(400).json({status:false,message:"email must contain letters , numbers and specific symbol and use .in or .com"})
        }
        const existingEmail = await Author.findOne({
            email:email
        })
        if(!existingEmail){
            return res.status(400).json({status:false,message:"invalid email or password"})
        }

        if(!password){
            return res.status(404).json({status:false,message:"password is required"})
        }
        const existingPassword = await bcrypt.compare(password,existingEmail.password)
        if(!existingPassword){
            return res.status(400).json({status:false,message:"invalid enail or password"})
        }

        const token = jwt.sign({authorId:existingEmail._id},process.env.JWT_SECRET,{
            expiresIn: "9d"
        })
        return res.status(200).json({status:true,message:"user login successfully",token,data:existingEmail})
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({status:false,message:"internal server error"})
    }
}

