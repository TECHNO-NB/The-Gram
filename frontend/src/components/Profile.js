import React, { useEffect, useState } from "react";
import "./Profile.css";
import PostDetail from "./PostDetail";
import ProfilePic from "./ProfilePic";
import { toast } from "react-toastify";

export default function Profile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [bio, setBio] = useState("");
  const [BioServer, setBioServer] = useState("");
  const [changePic, setChangePic] = useState(false);

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  const changeprofile = () => {
    if (changePic) {
      setChangePic(false);
    } else {
      setChangePic(true);
    }
  };

  // fetch data from backend
  useEffect(() => {
    fetch(
      `/user/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setPic(result.post);
        setUser(result.user);

        console.log(pic);
      });
  }, []);

  const postBio = () => {
    //fetch image to mongodb
    fetch("/bio", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        bio: bio,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        notifyB(data.message);
        setBio("")
        window.location.reload();
       
      })
      .catch((err) => console.log(err));
      
  };
  useEffect(() => {
    fetch("/getbio", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
     })
        .then((res) => res.json())
        .then((data) => {
          setBioServer(data.bio.bio)
           
        })
        .catch((err) => console.log(err));
  }, [])
  
 
  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img
            onClick={changeprofile}
            src={user.Photo ? user.Photo : picLink}
            alt=""
          />
        </div>
        {/* profile-data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{pic ? pic.length : "0"} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>
          <h5>{BioServer}</h5>
          <div>
            <input
              onChange={(e) => setBio(e.target.value)}
              placeholder="ADD BIO.."
            />
            <button onClick={postBio}>ADD BIO</button>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "90%",
          margin: "auto",
          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        {Array.from(pic) &&
          pic.map((pics) => {
            return (
              <img
                key={pics._id}
                className="item"
                src={pics.photo}
                alt="photo"
                onClick={() => {
                  toggleDetails(pics);
                }}
              ></img>
            );
          })}
      </div>
      {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}
      {changePic && <ProfilePic changeprofile={changeprofile} />}
    </div>
  );
}
