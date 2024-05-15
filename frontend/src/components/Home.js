import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { LoginContext } from "../context/LoginContext";

export default function Home() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  //toast function
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const { message, setMessage } = useContext(LoginContext);

  useEffect(() => {
    if (message === true) {
      notifyB("Message Received");
      setMessage(false);
    }
  }, [message]);
  

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("./signup");
    }

    //    Fetching all posts
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result);
      })
      .catch((err) => console.log(err));
  }, []);

  //to show and hide comments
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  };

  //Fetching like on post
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  //Fetching unlike on posts
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  //function to make comment
  const makeComment = (text, id) => {
    console.log(text);
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("Comment Posted");
        console.log(result);
      });
  };

  return (
    <div className="home">
      {/* card */}
      {data.map((posts) => {
        return (
          <div className="card">
            {/* card header */}
            <div className="card-header">
              <div className="card-pic">
                <img
                  src={posts.postedBy.Photo ? posts.postedBy.Photo : picLink}
                  alt=""
                />
              </div>
              <h5>
                <Link to={`/profile/${posts.postedBy._id}`}>
                  {posts.postedBy.name}
                </Link>
              </h5>
            </div>
            {/* card image */}
            <div className="card-image">
              <img src={posts.photo} alt="" />
            </div>
            {/* card content */}
            <div className="card-content">
              {posts.likes.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}

              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                {" "}
                View all comments
              </p>
            </div>
            {/* add commment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                className="comment"
                onClick={() => {
                  makeComment(comment, posts._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}

      {/* Show Comment */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
            </div>
            <div className="details">
              {/* card header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                    src="https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt=""
                  />
                </div>
                <h5>{item.postedBy.name}</h5>
              </div>

              {/* commentSection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {comment.postedBy.name}{" "}
                      </span>
                      <span className="commentText">{comment.comment}</span>
                    </p>
                  );
                })}
              </div>

              {/* card content */}
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add commment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useEffect, useState } from 'react'
// import './Home.css'
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// export default function Home() {
//     var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
//     const navigate = useNavigate();
//     const [data, setData] = useState([]);
//     const [comment, setComment] = useState("");
//     const [show, setShow] = useState(false);
//     const [item, setItem] = useState([])

//     //toast function
//     const notifyA = (msg) => toast.error(msg);
//     const notifyB = (msg) => toast.success(msg);

//     useEffect(() => {
//         const token = localStorage.getItem("jwt");
//         if (!token) {
//             navigate("./signup")
//         }

//         //    Fetching all posts
//         fetch("http://localhost:5000/allpost", {
//             headers: {
//                 "Authorization": "Bearer " + localStorage.getItem("jwt")
//             },
//         }).then((res) => res.json())
//             .then((result) => {
//                 console.log(result)
//                 setData(result)
//             })
//             .catch((err) => console.log(err))
//     }, [])

//     //to show and hide comments
//     const toggleComment = (posts) => {
//         if (show) {
//             setShow(false);
//         } else {
//             setShow(true);
//             setItem(posts);
//         }
//     };

//     //Fetching like on post
//     const likePost = (id) => {
//         fetch("http://localhost:5000/like", {
//             method: "put",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer " + localStorage.getItem("jwt")
//             },
//             body: JSON.stringify({
//                 postId: id
//             })
//         }).then((res) => res.json())
//             .then((result) => {
//                 const newData = data.map((posts) => {
//                     if (posts._id === result._id) {
//                         return result;
//                     } else {
//                         return posts;
//                     }
//                 })
//                 setData(newData);
//                 console.log(result);
//             })
//     }

//     //Fetching unlike on posts
//     const unlikePost = (id) => {
//         fetch("http://localhost:5000/unlike", {
//             method: "put",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer " + localStorage.getItem("jwt")
//             },
//             body: JSON.stringify({
//                 postId: id,
//             })
//         }).then((res) => res.json())
//             .then((result) => {
//                 const newData = data.map((posts) => {
//                     if (posts._id == result._id) {
//                         return result;
//                     } else {
//                         return posts;
//                     }
//                 })
//                 setData(newData);
//                 console.log(result);
//             })
//     };

//     //function to make comment
//     const makeComment = (text, id) => {
//         fetch("http://localhost:5000/comment", {
//             method: "put",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer " + localStorage.getItem("jwt")
//             },
//             body: JSON.stringify({
//                 text: comment,
//                 postId: id
//             }),
//         })
//             .then((res) => res.json())
//             .then((result) => {
//                 const newData = data.map((posts) => {
//                     if (posts._id == result._id) {
//                         return result;
//                     } else {
//                         return posts;
//                     }
//                 });
//                 setData(newData);
//                 setComment("");
//                 notifyB("Comment Posted");
//                 console.log(result);
//             });

//     };
// }
