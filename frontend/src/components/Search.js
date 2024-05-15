import React, { useEffect, useState } from "react";
import "./Search.css";
import logo from "../img/logo.png"
import { FaUserAstronaut } from "react-icons/fa";
import { Link } from "react-router-dom";
 

const Search = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/searchuser")
      .then((response) => response.json())
      .then((data) => {
        setAllUsers(data.alluser);
       
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const filteredUsers = allUsers.filter((user) => {
  
     if (search === "") return true;
    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search User"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="user-list">
        {search === "" ? (
          <h1>search User...</h1>
        ) : (
          filteredUsers.map((user) => (
            <div className="div" style={{display:'flex',alignItems:"center",justifyContent:"center",gap:"4px"}} key={user.id}>
                 <FaUserAstronaut style={{fontSize:"40px"}}/>
                 <h1><Link to={`/profile/${user._id}`}>
                                {user.name}
                            </Link></h1>
             
             
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
