const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const JWT_PRIVATE_KEY= process.env.JWT_PRIVATE_KEY

const registerUser = async (req,res) =>{
    try{
        const {name,email,password} = req.body;
        console.log(name,email,password);
       
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists, please use another email address',
        });
       }else{
      
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        
        const newUser = new User({
            name,
            email,
            password:hashedPassword,
        });
        await newUser.save()
        res.status(201).json({
            message: 'User created successfully',
            status:'success',
        });
    }
        
    }catch(error){
     console.log(error)
    }
}
const loginUser = async (req,res)=>{
    try{
     const {email,password} = req.body;
     const existingUser = await User.findOne({email: email});
     
     if(existingUser){
         const isPassword = await bcrypt.compare(password,existingUser.password);
         if(isPassword){
             const token = jwt.sign({userId: existingUser._id,username: existingUser.name}, JWT_PRIVATE_KEY,{ expiresIn: "1h",});
             res.status(200).json({
                message: 'User logged in successfully',
                email: existingUser.email,
                token,
                userId: existingUser._id,
                username: existingUser.name
              });
         }else{
             res.status(401).json({
                 message:'Email or password is incorrect'
             })
         }
     }else{
         res.status(404).json({
             message:'user not found'
         })
     }
    }catch(error){
      console.log(error)
    }
 
 }
 
 module.exports = {registerUser, loginUser};