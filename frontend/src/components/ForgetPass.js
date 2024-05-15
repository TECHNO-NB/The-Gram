import React, { useState } from "react";

import "./Forget.css";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function ForgetPass() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate =useNavigate();

  // If you need toast notifications and postData function, uncomment them or remove the comments
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const postData = () => {

fetch("/forgetpassword",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email:email,
            newPassword:password
        })
    }).then(res=>res.json())
    .then(data => {
         console.log(data)
         notifyB(data.message)
         navigate("/signin")
    })}

  return (
    <div className="signIn">
      <div>
        <div className="loginForm">
          <img className="signUpLogo" src={logo} alt="" />
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Email"
             
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="New Password..."
             
            />
          </div>
          <input
            type="submit"
            id="login-Btn"
            onClick={() => {
            postData()
            }}
            value="Change Password"
          />
        </div>
        <div className='loginForm2'>
                    Login Now :
                    <Link to='/signin'>
                        <span style={{ color: 'blue', cursor: 'pointer' }}>Sign In</span>
                    </Link>
                </div>
      </div>
    
    </div>
  );
}
