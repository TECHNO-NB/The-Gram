import React, { useContext } from 'react'
import logo from "../img/logo.png";
import './Navbar.css';
import { Link } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";

export default function Navbar({ login }) {
    const navigate = useNavigate()
    const { setModalOpen } = useContext(LoginContext)
    const loginStatus = () => {
        const token = localStorage.getItem("jwt")
        if (login || token) {
            return [
                <>
                    <Link to="/profile">
                        <li>Profile</li>
                    </Link>
                    <Link to="/createPost">
                        <li>Create Post</li>
                    </Link>
                    <Link style={{marginLeft:"20px"}} to="/followingpost">
                      My Following
                    </Link>
                    <Link style={{marginLeft:"25px" }} to="/search">
                       <IoMdSearch style={{fontSize:"25px", marginTop:"10px"}}/>
                    </Link>
                    <Link to={""}>
                        <button className='primaryBtn' onClick={() => setModalOpen(true)}>Log Out</button>
                    </Link>
                </>
            ]

        } else {
            return [
                <>
                    <Link to="/signup">
                        <li>SignUp</li>
                    </Link>
                    <Link to="/signin">
                        <li>SignIn</li>
                    </Link>
                </>
            ]
        }

    };
    const loginStatusMobile = ()=>{
        
            const token = localStorage.getItem("jwt")
            if (login || token) {
                return [
                    <>
                    <Link to="/">
                            <li><span class="material-symbols-outlined">
                               home
                            </span></li>
                        </Link>
                        <Link to="/profile">
                            <li><span class="material-symbols-outlined">
                             account_circle
                            </span></li>
                        </Link>
                        <Link to="/createPost">
                            <li><span class="material-symbols-outlined">
                               add_a_photo
                          </span></li>
                        </Link>
                        <Link style={{marginLeft:"0px"}} to="/followingpost">
                        <li>
                        <span class="material-symbols-outlined">
                             explore
                            </span>
                            </li>
                        </Link>
                        <Link style={{marginLeft:"0px" }} to="/search">
                       <IoMdSearch style={{fontSize:"20px", marginTop:"10px"}}/>
                    </Link>
                        <Link to={""}>
                            <li onClick={() => setModalOpen(true)}><span class="material-symbols-outlined">
                                     logout
                            </span></li>
                        </Link>
                    </>
                ]
    
            } else {
                return [
                    <>
                        <Link to="/signup">
                            <li>SignUp</li>
                        </Link>
                        <Link to="/signin">
                            <li>SignIn</li>
                        </Link>
                    </>
                ]
            
    
        };
    }

    return (
        <div className='navbar'>
            <img id='gram-logo' src={logo}  alt='' onClick={()=>{navigate("/")}} style={{cursor:"pointer"}} />
            <ul className='nav-menu'>
                {loginStatus()}
            </ul>
            <ul className='nav-mobile'>
                {loginStatusMobile()}
            </ul>
        </div>
    );
}
