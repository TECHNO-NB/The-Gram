const mongoose = require("mongoose");
const { Socket } = require("socket.io");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Photo: {
    type: String,
  },
  socketId: {
    type: String,
  },
  bio:{
   type:String,
  },
  followers: [
    {
      type: ObjectId,
      ref: "USER",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "USER",
    },
  ],
});

const USER=mongoose.model("USER", userSchema);
module.exports=USER;

