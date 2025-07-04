const express= require("express");
const User= require ('../model/User');
const bcrypt= require("bcryptjs");
const {createSecretToken} = require("../util/SecretToken");
const nodemailer = require("nodemailer");
const crypto =require( 'crypto');
require("dotenv").config();


exports.postSignup= async (req, res)=>{
    const {username, email, password}=req.body;
   
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields (username, email, password) are required"
        });
    }

    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message:" email is already register"
            });   
        }else{
            const newUser= await User.create({
                username,
                email,
                password,
                provider:'local'
            });
          

        res.status(201).json({
            success:true,
            message: "user register successfully"
        });
        }
     } catch(err){
            console.log("signup Error",err)
            res.status(501).json({
                success:false,
                message: "server error"
            });
        }
    }

exports.postLogin= async (req,res)=>{
   const {email, password}=req.body;
 try{
   if(!email && !password){
   return res.status(400).json({
    message: "please fill all the fields"
   }) ;
   } 
const user=await User.findOne({email});
if(!user){
    return res.status(401).json({message:"incorrect email"});
}

const isMatch= await bcrypt.compare(password, user.password);
if(!isMatch){
return res.status(401).json({message: "password incorrect"});
}

const token =await createSecretToken(user._id);
res.cookie("token",token , {
   withCredentails: true,
   httpOnly: true
});

res.status(201).json({
message: "user login successfully"
});
 }catch(err){
    console.error("login error", err);
 }
}

exports.Logout= (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  
    return res.json({ status: true });
  };

exports.forgetPassword = async (req,res)=>{
 const {email}=req.body;
 try{
    const user= await User.findOne({email});
    if(!user){
        return res.json({message:"email is not registered"});
    }
const token=crypto.randomBytes(20).toString("hex");
user.resetToken=token;
user.resetTokenExpiry=Date.now()+ 15*60*1000;
await user.save();

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

const transporter=nodemailer.createTransport({
    service: "Gmail",
    auth:{user:process.env.EMAIL_USER  , pass: process.env.EMAIL_PASS}
});

const resetlink= `http://localhost:3000/reset-password/${token}`;
const mailOptions={
    to: email,
    subject:"Password Reset",
    text: `click too reset: ${resetlink}`,
};

await transporter.sendMail(mailOptions,(error, info)=>{
if(error){
    console.error("Email sending error:", error); 
    return res.status(500).json({message:"failed to send email"});
}
console.log("Email sent:", info.response); 
res.json({message:"reset link send to your mail"});
})
 }catch(err){
console.error("err in foeget poassword",err);
 }
 
};



exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password; // Will be hashed automatically by your model
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


