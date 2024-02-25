import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import { registerRoute } from "../utils/APIRoutes";
import PasswordStrengthBar from 'react-password-strength-bar';
import { useNavigate, Link } from "react-router-dom";
<<<<<<< HEAD
=======
//import Logo from "../assets/logo.png";
>>>>>>> d1a7133 (Update on frontend)


const Register = () => {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

<<<<<<< HEAD
  const [value, setValue] = useState({
    username: "",
  });
  const [values, setValues] = useState({
=======

  const [values, setValues] = useState({
    username: "",
>>>>>>> d1a7133 (Update on frontend)
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
<<<<<<< HEAD
    setValue({ ...value, [event.target.name]: event.target.value });
=======
>>>>>>> d1a7133 (Update on frontend)
    setValues({ ...values, [event.target.name]: event.target.value });
  };



  const handleValidation = () => {
    const { password, confirmPassword, username } = values;
    if (password !== confirmPassword) {
      toast.error(
<<<<<<< HEAD
        "Password and confirm password should be same.",
=======
        "Les mots de passes doivent être identiques.",
>>>>>>> d1a7133 (Update on frontend)
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
<<<<<<< HEAD
=======
    if (values.surname === ""){
      values.surname = values.username;
    }
>>>>>>> d1a7133 (Update on frontend)

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
<<<<<<< HEAD
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

=======
          <p className='title'>Créez votre compte Neutrino</p>
         
          <div className="input-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            onChange={(e) => handleChange(e)}  
          /></div>

          <div className="input-group">
          <label for="surename">Pseudo</label>
          <input
            type="surname"
            name="surname"
            onChange={(e) => handleChange(e)}          
          /></div>

          <div className="input-group">
          <label for="password">Mot de passe</label>
>>>>>>> d1a7133 (Update on frontend)
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
<<<<<<< HEAD
          />

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <PasswordStrengthBar scoreWordStyle={{font:"Segoe UI", color: "#716E74"}} shortScoreWord='Trop court' scoreWords={['Très Faible','Faible','Normal','Bien','Fort']} password={getPassword()} />
          
          <button className="button2" type="submit">Create User</button>
=======
          /></div>

          <div className="input-group">
          <label for="password">Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          /></div>
          
          <PasswordStrengthBar style={{}} scoreWordStyle={{color: "#716E74"}} shortScoreWord='Trop court' scoreWords={['Très Faible','Faible','Normal','Bien','Fort']} password={getPassword()} />
          
          <button className="button2" type="submit">Créer un compte</button>
          <span>
            Already have an account ? <Link to="/">Log in.</Link>
          </span>
>>>>>>> d1a7133 (Update on frontend)
          
        
      </form>
      </FormContainer>
      <ToastContainer />
    </div>

  );
};

export default Register;
const FormContainer = styled.div`
<<<<<<< HEAD
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
=======
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
      font-family: "Galey 1", sans-serif;
      text-align: left;
      font-size: 1.75rem;
      line-height: 2rem;
      font-weight: 700;
      
    }

  form {
    gap: 1.25rem;
    background-color: white;
    display: flex;
    flex-direction: column;
    width: 400px;
    border-radius: 1em;
    padding: 3rem;
    box-shadow: 0 0 .5vw #638ecb, 0 0 0 .15vw transparent;
    margin-top: 1.5rem;
  }
  span {
    font-family: "Galey 1", sans-serif;
    font-size: 1.2rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .input-group label {
    display: block;
    font-size: 1rem;
    margin-bottom: 4px;
  }

  input {
    font-family: "Galey 1","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    font-weight: 500;
    font-size: 1.2rem;
    color: black;
    background-color: #fff;
    border: 2px solid #b1c9ef;
    border-radius: 0.375rem;
    outline: 0;
    padding: 0.75rem 1rem;
    width: 90%;
    transition: .2s;
  }

  
  input:focus {
    border: 2px solid #395886;
  }
  .button2 {
    font-family: "Galey 1","Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    background: #d5deef;
>>>>>>> d1a7133 (Update on frontend)
    display: inline-block;
    transition: all 0.2s ease-in;
    position: relative;
    overflow: hidden;
    z-index: 1;
<<<<<<< HEAD
    font-weight: 600;
    font-size: .9vw;
    color:  	#69369e;
    padding: 0.7em 1.7em;
    cursor: pointer;
    border-radius: 0.5em;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
    box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #fff;
=======
    font-weight: 500;
    font-size: 1.2rem;
    color:  	black;
    padding: 0.7em 1.7em;
    cursor: pointer;
    border-radius: 0.5em;
    border: 1px solid #d5deef;

>>>>>>> d1a7133 (Update on frontend)
  }
  
  .button2:active {
    color: #666;
<<<<<<< HEAD
    box-shadow: inset 4px 4px 12px #e8e8e8, inset -4px -4px 12px #fff;
=======
    box-shadow: inset 4px 4px 12px #d5deef, inset -4px -4px 12px #fff;
>>>>>>> d1a7133 (Update on frontend)
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
<<<<<<< HEAD
    border: 1px solid #69369e;
=======
    border: 1px solid black;

>>>>>>> d1a7133 (Update on frontend)
  }
  
  .button2:hover:before {
    top: -35%;
<<<<<<< HEAD
    background-color: #69369e;
=======
    background-color: #395886;
>>>>>>> d1a7133 (Update on frontend)
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  .button2:hover:after {
    top: -45%;
<<<<<<< HEAD
    background-color: #69369e;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  }

`;
=======
    background-color: black;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  @media (max-width: 480px) {
    height: 100%;
    width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .title {
    font-family: "Galey 1", sans-serif;
    text-align: left;
    font-size: 1rem;
    line-height: 1rem;
    font-weight: 700;
    
  }

form {
  gap: 0.8rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 1em;
  padding: 1.5rem;
  box-shadow: 0 0 .5vw #638ecb, 0 0 0 .15vw transparent;
}
span {
  font-family: "Galey 1", sans-serif;
  font-size: 0.6rem;
}

.input-group {
  margin-top: 0.125rem;
  font-size: 0.450rem;
  line-height: 0.613rem;
}

.input-group label {
  display: block;
  font-size: 1rem;
  margin-bottom: 4px;
}

input {
  font-family: "Galey 1","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
  font-weight: 500;
  font-size: 0.8rem;
  color: black;
  background-color: #fff;
  border: 2px solid #b1c9ef;
  border-radius: 0.175rem;
  outline: 0;
  padding: 0.375rem 0.5rem;
  width: 90%;
  transition: .2s;
}


input:focus {
  border: 2px solid #395886;
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
  border: 1px solid #d5deef;

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
`;

>>>>>>> d1a7133 (Update on frontend)
