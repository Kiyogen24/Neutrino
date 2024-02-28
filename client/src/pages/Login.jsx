import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import Logo from "../assets/logo.png";


const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [loginAttempts, setLoginAttempts] = useState(0); // Track login attempts
  const [active, setActive] = useState(0); 
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Username and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
        setLoginAttempts((prevAttempts) => prevAttempts + 1); // Increment login attempts
        toast.info(`Il vous reste ${4 - loginAttempts} tentatives`, toastOptions);
        if (loginAttempts >= 4) {
          toast.error("Maximum login attempts reached.", toastOptions);
          return; // Add this line to prevent further login attempts
        }
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>

            <h1 className="title">Se connecter</h1>
          <span className='IDe'>Saisissez vos identifiants</span>
          
            
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={`@${values.username}`}
              onChange={(e) => {
                if (e.target.value.startsWith("@")) {
                  setValues({ ...values, username: e.target.value.slice(1) });
                }
              }}
              min="3"
            />
          
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button className="button2" type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

export default Login;

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .title {
    text-align: left;
    font-size: 1.75rem;
    line-height: 2rem;
    font-weight: 700;
    
  }
  .IDe {
    color: #395886;
    font-size: 1.2rem;
  }
  form {
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border-radius: 2rem;
    padding: 3rem 4rem;
    box-shadow: 0 0 .5vw #638ecb, 0 0 0 .15vw transparent;
    
  }
  span {
    
    font-size: 1.2rem;
  }

  input {
    
    font-weight: 500;
    font-size: 1.2rem;
    color: black;
    background-color: #fff;
    box-shadow: 0 0 0 .1vw #b1c9ef;
    border-radius: 0.4vw;
    border: none;
    outline: none;
    padding: 0.8vw;
    width: 25rem;
    height: 1.2rem;
    transition: .2s;
  }

  
  input:focus {
    box-shadow: 0 0 0 .15vw #395886;
  }
  .button2 {
    font-family: "Galey 1","Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    background: #d5deef;
    display: inline-block;
    transition: all 0.2s ease-in;
    position: relative;
    overflow: hidden;
    z-index: 1;
    font-weight: 500;
    font-size: 1.2rem;
    color:  	black;
    padding: 0.7em 1.7em;
    cursor: pointer;
    border-radius: 0.5em;
    border: 1px solid #638ecb;

  }
  
  .button2:active {
    color: #666;
    box-shadow: inset 4px 4px 12px #d5deef, inset -4px -4px 12px #fff;
  }
  
  .button2:before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%) scaleY(1) scaleX(1.25);
    top: 100%;
    width: 140%;
    height: 180%;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
  }
  
  .button2:after {
    content: "";
    position: absolute;
    left: 55%;
    transform: translateX(-50%) scaleY(1) scaleX(1.45);
    top: 180%;
    width: 160%;
    height: 190%;
    background-color: #69369e;
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
  }
  
  .button2:hover {
    color: #ffffff;
    border: 1px solid black;

  }
  
  .button2:hover:before {
    top: -35%;
    background-color: #395886;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  .button2:hover:after {
    top: -45%;
    background-color: black;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  @media (max-width: 768px) {
    height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .brand {
    display: flex;
    align-items: left;
    justify-content: left;
    img {
      height: 3.5rem;
    }
    h1 {
      font-family: "Against", sans-serif;
      font-size: 1.5rem;
      color:  black;
      font-weight: 900;
      text-shadow: 0.1rem 0.1rem 0.1rem #d5deef; 
    }
  }
  .IDe {
    color: #395886;
    font-size: 0.6rem;
  }
  form {
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 1rem;
    padding: 1.5rem 2rem;
    box-shadow: 0 0 .5vw #638ecb, 0 0 0 .15vw transparent;
    
  }
  span {
    font-family: "Galey 1", sans-serif;
    font-size: 0.6rem;
  }

  input {
    font-family: "Galey 1","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 0.6rem;
    color: black;
    background-color: #fff;
    box-shadow: 0 0 0 .05vw #b1c9ef;
    border-radius: 0.4vw;
    border: none;
    outline: none;
    padding: 0.8vw;
    width: 12.5rem;
    height: 1.2rem;
    transition: .2s;
  }

  
  input:focus {
    box-shadow: 0 0 0 .15vw #395886;
  }
  .button2 {
    font-family: "Galey 1","Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    background: #d5deef;
    display: inline-block;
    transition: all 0.2s ease-in;
    position: relative;
    overflow: hidden;
    z-index: 1;
    font-weight: 500;
    font-size: 0.6rem;
    color:  	black;
    padding: 0.35em 0.85em;
    cursor: pointer;
    border-radius: 0.25em;
    border: 1px solid #638ecb;

  }
  
  .button2:active {
    color: #666;
    box-shadow: inset 4px 4px 12px #d5deef, inset -4px -4px 12px #fff;
  }
  
  .button2:before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%) scaleY(1) scaleX(1.25);
    top: 100%;
    width: 140%;
    height: 180%;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
  }
  
  .button2:after {
    content: "";
    position: absolute;
    left: 55%;
    transform: translateX(-50%) scaleY(1) scaleX(1.45);
    top: 180%;
    width: 160%;
    height: 190%;
    background-color: #69369e;
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
  }
  
  .button2:hover {
    color: #ffffff;
    border: 1px solid black;

  }
  
  .button2:hover:before {
    top: -35%;
    background-color: #395886;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  .button2:hover:after {
    top: -45%;
    background-color: black;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  }
`;

