import React from 'react';
import './PostDetail.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PostDetail({ item,toggleDetails }) {
//   if (!item) {
//     return null; // Render nothing if item is undefined or null
//   }

  const navigate = useNavigate()
  //toast function
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const removePost = (postId)=>{
    if(window.confirm("Do you really want to delete this post ?")){
        fetch(`/deletePost/${postId}`,{
            method:'delete',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        })
        .then((res)=>res.json())
        .then((result)=>{
            console.log(result);
            toggleDetails(result);
            navigate("/");
            notifyB(result.message);
        })
        
    }
       
  }


  const { photo, postedBy, comments, likes, body } = item;

  return (
    <div className="showComment">
      <div className="container">
        <div className="postPic">
          <img src={photo} alt='' />
        </div>
        <div className="details">
          {/* card header */}
          <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
            <div className="card-pic">
              <img src='https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=600' alt='' />
            </div>
            <h5>{postedBy && postedBy.name}</h5>
            <div className="deletePost" onClick={()=>{removePost(item._id)}}>
            <span className="material-symbols-outlined">
             delete
            </span>
            </div>
          </div>

          {/* commentSection */}
          <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
            {comments && comments.map((comment) => {
              return (
                <p className='comm'>
                  <span className='commenter' style={{ fontWeight: "bolder" }}>
                    {comment.postedBy && comment.postedBy.name}{" "}
                  </span>
                  <span className='commentText'>{comment.comment}</span>
                </p>
              );
            })}
          </div>

          {/* card content */}
          <div className="card-content">
            <p>{likes && likes.length} Likes</p>
            <p>{body}</p>
          </div>

          {/* add comment */}
          <div className="add-comment">
            <span className="material-symbols-outlined">mood</span>
            <input type='text' placeholder='Add a comment' />
            <button className='comment'>Post</button>
          </div>
        </div>
      </div>
      <div className="close-comment" onClick={()=>{toggleDetails();}} >
        <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
      </div>
    </div>
  );
}
