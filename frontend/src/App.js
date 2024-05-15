// import logo from './logo.svg';
import React, { createContext, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Profile from "./components/Profile";
import Createpost from "./components/Createpost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "./context/LoginContext";
import Modal from "./components/Modal";
import UserProfile from "./components/UserProfile";
import MyFollowingPost from "./components/MyFollowingPost";
import ForgetPass from "./components/ForgetPass";
import Search from "./components/Search";
import Privatemsg from "./components/Privatemsg";
import PrivatemsgChat from "./components/PrivatemsgChat";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider
          value={{ setUserLogin, setModalOpen, message, setMessage }}
        >
          <Navbar login={userLogin} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            <Route exact path="/profile" element={<Profile />}></Route>
            <Route path="/createPost" element={<Createpost />}></Route>
            <Route path="/profile/:userid" element={<UserProfile />}></Route>
            <Route path="/followingpost" element={<MyFollowingPost />}></Route>
            <Route path="/forgetpass" element={<ForgetPass />}></Route>
            <Route path="/search" element={<Search />}></Route>
            <Route path="/privatemsg" element={<Privatemsg />}></Route>
            <Route
              path="/privatechat/:user"
              element={<PrivatemsgChat />}
            ></Route>
          </Routes>
          <ToastContainer theme="dark" />

          {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
