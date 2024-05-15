import React, { useState, useEffect, useContext} from "react";
import "./Privatemsg.css";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Privatemsg = () => {
  const [data, setData] = useState([]);

  const location = useLocation();
  const { prop1 } = location.state;
 
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);

      })
      .catch((err) => console.log(err));
  }, []);

  console.log(data);

  return (
    <>
      {data.map((val) => {
        return (
          <h1 onClick={()=>{
      
      }}>
            {" "}
            <Link  to={`/privatechat/${val.postedBy._id}`}>
              {val.postedBy.name}{" "}
            </Link>{" "}
          </h1>
        );
      })}
    </>
  );
};

export default Privatemsg;
