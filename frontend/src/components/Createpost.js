import React,{useState, useEffect} from 'react'
import './Createpost.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Createpost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const navigate = useNavigate()

  //toast function
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(()=>{

       //saving post to mongodb
       if(url){
        fetch("/createPost", {
          method:"post",
          headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          },
          body: JSON.stringify({
            body,
            pic: url
          })
        })    
         .then(res => res.json())
         .then(data => {if(data.error){
          notifyA(data.error)
         }else{
          notifyB("Successfully Posted")
          navigate("/")

         }})
         .catch(err => console.log(err))

       }
      

  }, [url])

  // posting image to cloudinary
  const postDetails = ()=>{
    console.log(body, image)
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "instaclone")
    data.append("cloud_name", "doqlyrrkl")
    fetch("https://api.cloudinary.com/v1_1/doqlyrrkl/image/upload",
      {
                        method: "post",
                        body: data
                    })
    .then(res=>res.json())
    .then(data => setUrl(data.url))
    .catch(err=>console.log(err))
        console.log(url)
      
  }

  const loadfile = (event) => {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src); // free memory
  };
};
  return (
    <div className='createPost'>
      {/* Header */}
      <div className="post-header">
        <h4 style={{margin:"3px auto"}}>Create New Post</h4>
        <button id="post-btn" onClick={()=>{postDetails()}}>Share</button>
      </div>
      {/* Image preview */}
      <div className="main-div">
        <img id='output' src='https://th.bing.com/th/id/OIP.QgsAktNpJ5PWjy8RoRBn0QHaHa?w=209&h=209&c=7&r=0&o=5&dpr=1.3&pid=1.7'/>
        <input type='file' accept='image/*' onChange={(event)=>{
            loadfile(event);
            setImage(event.target.files[0])
        }}/>
      </div>
      {/* details */}
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
          <img src='https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=600' alt=''/>
          </div>
          <h5>NB</h5>
        </div>
        <textarea value={body} onChange={(e)=>{
          setBody(e.target.value)
        }} type="text" placeholder='Write a caption....'></textarea>
      </div>
    </div>
  )
}
