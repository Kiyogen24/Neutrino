import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import { registerRoute } from "../utils/APIRoutes";
import PasswordStrengthBar from 'react-password-strength-bar';
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const [value, setValue] = useState({
    username: "",
  });
  const [values, setValues] = useState({
    surname: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
        document.body.style.overflow = "scroll"
    };
  }, []);

  const getPassword = () => {
    return values.password;
  };


  const handleChange = (event) => {
    setValue({ ...value, [event.target.name]: event.target.value });
    setValues({ ...values, [event.target.name]: event.target.value });
  };



  const handleValidation = () => {
    const { password, confirmPassword, username } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } 

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, surname, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        surname,
        password,
      });
      console.log(data);
      
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
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
    

      <div className='all'>
      <FormContainer>
      <form onSubmit={(e) => handleSubmit(e)}>
      <div className="brand">
            
            <h1>LockChat</h1>
          </div>
          
          
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}  
          />

          <input
            type="surname"
            placeholder="Surname"
            name="surname"
            onChange={(e) => handleChange(e)}          
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <PasswordStrengthBar scoreWordStyle={{font:"Segoe UI", color: "#716E74"}} shortScoreWord='Trop court' scoreWords={['Très Faible','Faible','Normal','Bien','Fort']} password={getPassword()} />
          
          <button className="button2" type="submit">Create User</button>
          
        
      </form>
      </FormContainer>
      <ToastContainer />
    </div>

  );
};

export default Register;
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(225deg, #f8f1ff, #ddc2ff);
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      font-size: 1.75vw;
      color:  #69369e;
    }
  }
  form {
    display: flex;
    
    flex-direction: column;
    gap: 2rem;
    background-color: #e8e8e8;
    border-radius: 2rem;
    padding: 3rem 4rem;
  }
  input {
    font-family: "Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: .8vw;
    color: black;
    background-color: #f8f1ff;
    box-shadow: 0 0 .4vw #ddc2ff, 0 0 0 .15vw transparent;
    border-radius: 0.4vw;
    border: none;
    outline: none;
    padding: 0.8vw;
    width: 25rem;
    transition: .2s;
  }
  
  input:hover {
    box-shadow: 0 0 0 .15vw rgba(138,43,255, 0.326);
  }
  
  input:focus {
    box-shadow: 0 0 0 .15vw #69369e;
  }
  .button2 {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    display: inline-block;
    transition: all 0.2s ease-in;
    position: relative;
    overflow: hidden;
    z-index: 1;
    font-weight: 600;
    font-size: .9vw;
    color:  	#69369e;
    padding: 0.7em 1.7em;
    cursor: pointer;
    border-radius: 0.5em;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
    box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #fff;
  }
  
  .button2:active {
    color: #666;
    box-shadow: inset 4px 4px 12px #e8e8e8, inset -4px -4px 12px #fff;
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
    border: 1px solid #69369e;
  }
  
  .button2:hover:before {
    top: -35%;
    background-color: #69369e;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  .button2:hover:after {
    top: -45%;
    background-color: #69369e;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  }

`;
