const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = require("../models/model")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
// const {Jwt_secret} = require("../keys");
const { Jwt_secret } = require("../keys")
const requireLogin = require("../middleware/requireLogin");
const POST = require("../models/post")





router.post("/signup",(req, res)=>{
   const {name, userName, email, password,socketId} = req.body;
   if(!name || !email || !userName|| !password){
    return res.status(422).json({ error: "Please add all the fields"})
   }
   USER.findOne({ $or: [{ email: email}, {userName: userName }] }).then((savedUser) => {
    if (savedUser){
        return res.status(422).json({ error: "User already exist with that email or userName"})
    }
   })

   bcrypt.hash(password, 12).then((hashedPassword)=>{
    const user = new USER({
        name,
        email,
        userName,
        socketId,
        password:hashedPassword
       })
    
       user.save()
       .then(user=>{
        res.json({message:"Registered successfully"})
       })
       .catch(err => {
        console.log(err)
   })



  
})
}) 

router.post("/signin",(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({ error: "Please add email and password"})
    }
    USER.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email"})
        }
       bcrypt.compare(password, savedUser.password).then((match)=>{
        if(match){
               
            const token = jwt.sign({_id:savedUser._id}, Jwt_secret)
            const {_id,name,email,userName,socketId} = savedUser
            res.json({token:token,user:{_id,name,email,userName,socketId}})
            console.log({token:token,user:{_id,name,email,userName}})
            //  res.status(200).json
            // ({token:token,user:{_id,name,email,userName}})
            // console.log({token,user:{_id,name,email,userName}})
        }else{
            return res.status(422).json({error:"Invalid password"})
        }

       })
       .catch( err => console.log(err)) 
    })
})

router.post("/forgetpassword", async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(422).json({ error: "Please provide both email and newPassword" });
    }
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const passwordChanged = await USER.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } }
        );
        if (!passwordChanged) {
            return res.status(422).json({ error: "Failed to update password" });
        }
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/searchuser", async (req, res) => {
 const alluser=await USER.find()
 res.status(200).json({alluser:alluser})
});

module.exports = router;