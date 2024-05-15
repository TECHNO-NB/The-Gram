import React, { useState, useEffect, useRef } from 'react';

export default function ProfilePic({ changeprofile }) {
    const hiddenFileInput = useRef(null)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")


    // posting image to cloudinary
    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instaclone")
        data.append("cloud_name", "doqlyrrkl")
        fetch("https://api.cloudinary.com/v1_1/doqlyrrkl/image/upload",
            {
                method: "post",
                body: data
            })
            .then(res => res.json())
            .then(data => setUrl(data.url))
            .catch(err => console.log(err))
        console.log(url)

    };

    const postPic = () => {
        //fetch image to mongodb
        fetch("/uploadProfilePic", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                pic: url
            })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                changeprofile()
                window.location.reload();

            }).catch((err) => console.log(err));
    }



    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    useEffect(() => {
        if (image) {
            postDetails();
        }

    }, [image]);

    useEffect(() => {
        if (url) {
            postPic();
        }
    }, [url])

    return (
        <div className='profilePic darkBg'>
            <div className="changePic centered">
                <div>
                    <h2>Change profile Photo </h2>
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button className='upload-btn' style={{ color: "#1EA1F7" }} onClick={handleClick}>Upload Photo</button>
                    <input type='file' ref={hiddenFileInput} accept='image/*' style={{ display: "none" }} onChange={(e) => { setImage(e.target.files[0]) }} />
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button className='upload-btn' style={{ color: "#ED4956" }} onClick={() => {
                        setUrl(null);
                        postPic();
                    }}>
                        {" "}
                        Remove current photo</button>
                </div>
                <div style={{ borderTop: "1px solid #00000030" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px" }} onClick={changeprofile}>Cancel</button>
                </div>
            </div>

        </div>

    )
}
