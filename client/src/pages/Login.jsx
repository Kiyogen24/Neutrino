import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { BsExclamationCircleFill } from "react-icons/bs"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { AiOutlineInfoCircle } from "react-icons/ai"
import { BsCheck2 } from "react-icons/bs"
import Reaptcha from 'reaptcha';
import Logo from "../assets/neutrino.png"
import GlobeIcon from "../assets/Globe.png"
import Spinner from "../assets/Spinner.svg"
import "./css/Login.css"


const Login = () => {

  const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  };

  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  const verify = () =>{
          captchaRef.current.getResponse().then(res => {
              setCaptchaToken(res);
              console.log(captchaToken)
          })

      }

  const [attempts, setAttempts] = useState(sessionStorage.getItem('loginAttempts') || 0);
  const [perm_attempts, setPermAttempts] = useState(localStorage.getItem('loginPermAttempts') || 0);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [checkbox, setCheckbox] = useState(false)
  const [errors, setErrors] = useState({ username: undefined, password: undefined })
  const [loading, setLoading] = useState(false)
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [redirect, setRedirect] = useState(true)
  const [showRecaptcha, setShowRecaptcha] = useState(false) // Add state for reCAPTCHA
  
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Neutrino — Connexion"
    if (localStorage.getItem("app-user")) {
      navigate("/");
      }
    else if (sessionStorage.getItem("app-user")){
      navigate("/");
    }
    else {
      setRedirect(false);
    }
    
  }, [])

  useEffect(() => {
    if (username.length >= 4 && username.length <= 20) {
      setErrors(prev => {
        return {...prev, username: undefined}
      })
    }

    setErrors(prev => {
      return {...prev, password: undefined}
    })
  }, [username, password])

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username=== "" && password===""){
      console.log("Le nom d'utilisateur et le mot de passe ne doivent pas être vides.")
      return;
    }
    setLoading(true);
    console.log(perm_attempts);
    if (attempts >= 5) {
      toast.error("Nombre de tentatives maximal atteint.", toastOptions);
      setLoading(false);
      return;
    }

    if (perm_attempts >= 5) {
      if (!showRecaptcha) {
      setShowRecaptcha(true);
      setLoading(false);
      return;
      }
    }
    /*
    if (perm_attempts >= 6) {
      const token = captchaRef.current.getValue();
      captchaRef.current.reset();
    }*/
    
    const response = await axios.post(loginRoute, {
      username, password,
    })

    const data = response.data;

    setLoading(false);
    

    if (data.status === false) {
      toast.error(data.msg, toastOptions);
      sessionStorage.setItem('loginAttempts', Number(attempts) + 1);
      setAttempts(Number(attempts)+1);
      setPermAttempts(Number(perm_attempts)+1);
      localStorage.setItem('loginPermAttempts', Number(perm_attempts) + 1);
      toast.info(`Il vous reste ${4 - attempts} tentatives`, toastOptions);
      }
    if (data.status === true) {
      if (checkbox) {
      sessionStorage.setItem('loginAttempts', 0);
      localStorage.setItem('loginPermAttempts', 0);
      setAttempts(0);
      setPermAttempts(0);
      localStorage.setItem(
        "app-user",
        JSON.stringify(data.user)
      );
      console.log(localStorage.getItem("app-user"));
    }
      else {
        sessionStorage.setItem('loginAttempts', 0);
        localStorage.setItem('loginPermAttempts', 0);
        setAttempts(0);
        setPermAttempts(0);
        try { sessionStorage.setItem(
        "app-user",
        JSON.stringify(data.user)); }
        catch(error) {
          console.log('Session Storage est désactivé.');
        }
      }
      
      navigate("/");
    }
  }

  return (
    redirect === false ? (
      <div className="formulaire">
        <div className="navigation">
          <img src={Logo} alt="" />
          <div>
            <img src={GlobeIcon} alt="" />
            <span>Français</span>
          </div>
        </div>
        <div className="container">
          <div className="contenu">
            <div className="header">
              <h2 className='title'>Se connecter</h2>
              <span>pour accéder à <span className='neutrino'>Neutrino</span></span>
            </div>
            <div className="inputs-group">
              <div className="gumdrops-ace">
                <span>Nom d'utilisateur</span>
                <input className={errors.username ? "error" : undefined} value={`@${username}`} 
                  onChange={(e) => {
                    if (e.target.value.startsWith("@")) {
                    setUsername(e.target.value.slice(1) );
                    }
                  }} />
                {errors.username ? (
                  <div className="reemploy-pion">
                    <BsExclamationCircleFill />
                    {errors.username}
                  </div>
                ) : undefined}
              </div>
              <div className="gumdrops-ace">
                <span>Mot de passe</span>
                <input
                  className={passwordHidden && errors.confirmPassword ? "mondays-gees error" : (passwordHidden ? "mondays-gees" : undefined)} 
                  type={passwordHidden ? "password" : "text"}
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                <div className="praised-yald">
                  {passwordHidden ? <FaRegEye onClick={() => setPasswordHidden(false)} /> : <FaRegEyeSlash onClick={() => setPasswordHidden(true)} />}
                </div>
                {errors.password ? (
                  <div className="reemploy-pion">
                    <BsExclamationCircleFill />
                    {errors.password}
                  </div>
                ) : undefined}
              </div>
            </div>
            <div className="realise-rid">
              <div onClick={() => setCheckbox(prev => !prev)}>
                <div className={checkbox === true ? "checkbox active" : "checkbox"}>
                  {checkbox === true ? <BsCheck2 className="uprootal-lug" /> : undefined}
                </div>
                <span>Me garder connecter</span>
                <AiOutlineInfoCircle />
              </div>
              <div className="prankish-sod">
                <span>Pas votre appareil? Utilisez une fenêtre de navigation privée</span> 
                <span className="marrows-chew">En apprendre plus</span>
                
              </div>
            </div>
            {showRecaptcha ? (
              <div className="redirection">
              <div className="recaptcha">
              <Reaptcha 
                  sitekey={process.env.REACT_APP_SITE_KEY}
                  ref={captchaRef}
                  onVerify={verify} 
                />
              </div>
              <button disabled={!captchaToken} onClick={(e) => handleLogin(e)}>{loading ? <img src={Spinner} alt="" /> : "Se connecter"}</button>
              <div>
                Première fois sur Neutrino? <span onClick={() => navigate("/register")}>Créer un compte</span>
              </div>
              </div>
            ) : (
              <div className="redirection">
              <button onClick={(e) => handleLogin(e)}>{loading ? <img src={Spinner} alt="" /> : "Se connecter"}</button>
              <div>
                Première fois sur Neutrino? <span onClick={() => navigate("/register")}>Créer un compte</span>
              </div>
              </div>
            )}
            <div className="domes-pout">
              <span>Problèmes pour se connecter?</span>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>) : (
        // Loading spinner
        // Credits – https://loading.io
        <div className="_0vzh">
          <div className="clags-roe">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )
  )
}

export default Login
