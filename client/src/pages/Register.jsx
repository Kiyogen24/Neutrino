import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerRoute } from "../utils/APIRoutes";
import PasswordStrengthBar from 'react-password-strength-bar';
import { useNavigate } from "react-router-dom";
import { openDB } from 'idb';
import { BsExclamationCircleFill } from "react-icons/bs"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import Logo from "../assets/neutrino.png"
import { IoGlobeOutline } from "react-icons/io5";
import Spinner from "../assets/Spinner.svg"
import ProfilePicture from "../assets/pp_user.png";
import "./css/Register.css"
//import Logo from "../assets/logo.png";

const Register = () => {

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };


  const [username, setUsername] = useState("")
  const [surname, setSurname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({ 
      username: undefined, surname: undefined, password: undefined, confirmPassword: undefined 
  })
  const [loading, setLoading] = useState(false)
  const [passwordHidden, setPasswordHidden] = useState({ password: true, confirm: true })


  const navigate = useNavigate()


  useEffect(() => {
      document.title = "Neutrino — Inscription"

      if (password.length >= 8) {
          setErrors(prev => {
              return {...prev, password: undefined}
          })
      }

      if (confirmPassword.length >= 8 && password === confirmPassword) {
          setErrors(prev => {
              return {...prev, confirmPassword: undefined}
          })
      }
  }, [password, confirmPassword])

  useEffect(() => {
      if (username.length >= 4 && username.length <= 20) {
          setErrors(prev => {
            return {...prev, username: undefined}
          })
        } 
  }, [username])

  
  const checkPasswords = () => {

    if (username.length < 4 || username.length > 20) {
      setErrors(prev => {
         return {...prev, username: 'Le nom d\'utilisateur doit avoir entre 4 et 20 caractères'}
     })
    }

    if (username.includes('@')) {
      setErrors(prev => {
        return {...prev, username: 'Le nom d\'utilisateur ne doit pas contenir de @'}
    })
    }
      if (confirmPassword.length < 8) {
              setErrors(prev => {
                return {...prev, confirmPassword: "Le mot de passe doit contenir au moins 8 caractères"}
              })
              return false
            }

      if (password !== confirmPassword) {
              setErrors(prev => {
                return {...prev, confirmPassword: "Les mots de passe ne correspondent pas"}
              })
              return false
            }
        
      
            return true
          }


          async function storePrivateKeyInIndexedDB(userId, privateKey) {
            const db = await openIndexedDB();
            const tx = db.transaction("privateKeys", "readwrite");
            const store = tx.objectStore("privateKeys");
            await store.put(privateKey, userId);
            return tx.done;
          }
        
          async function openIndexedDB() {
            const db = await openDB("myApp", 1, {
              upgrade(db) {
                db.createObjectStore("privateKeys");
              },
            });
            return db;
          }
        
          async function generateKeys() {
            const keyPair = await window.crypto.subtle.generateKey(
              {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
              },
              true,
              ["encrypt", "decrypt"]
            );
            return keyPair;
          }


          const handleRegister = () => {
            
            const init = async () => {
                setLoading(true)
                const convertImageToBase64 = async (imageUrl) => {
                    try {
                        const response = await fetch(imageUrl);
                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        return new Promise((resolve, reject) => {
                            reader.onload = () => {
                                const base64String = reader.result;
                                const imageString = base64String.substring(base64String.indexOf(',') + 1);
                                resolve(imageString);
                            };
                            reader.onerror = (error) => {
                                reject(error);
                            };
                        });
                    } catch (error) {
                        console.error(error);
                        throw error;
                    }
                };
              
                // Générer une paire de clés
                const keyPair = await generateKeys();

                
                // Stocker la clé privée dans IndexedDB
                await storePrivateKeyInIndexedDB(username, keyPair.privateKey);

                const profilePictureBase64 = await convertImageToBase64(ProfilePicture);
                
                // Exporter la clé publique en format JWK
                const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey); 
                const response = await axios.post(registerRoute, {
                    username,
                    surname: surname || username,
                    password,
                    publicKey: publicKeyJwk,
                    avatarImage: profilePictureBase64,
                });

                const data = response.data
                setLoading(false)

                if (data.status === false) {
                    toast.error(data.msg, toastOptions);
                }
                if (data.status === true) {
                    localStorage.setItem(
                    "app-user",
                    JSON.stringify(data.user)
                    );
                    
                    navigate("/");
          }
      }

      const match = checkPasswords()

      if (match) { init() }
  }

  return (
      <div className="formulaire">
          <div className="navigation">
                <img src={Logo} alt="" style={{ width: '100px', height: 'auto' }} />
                <div>
                  <IoGlobeOutline />
                  <span>Français</span>
              </div>
          </div>
          <div className="container">
              <div className="contenu">
                  <div className="header">
                      <h2>Créer votre compte <strong>Neutrino</strong></h2>
                      <span>pour accéder à la messagerie</span>
                  </div>
                  <div className="inputs-group">
                      <div className="spastics-foe">
                          <span>Nom d'utilisateur</span>
                          <input className={errors.username ? "error" : undefined} value={`@${username}`} 
                          onChange={(e) => {
                            if (e.target.value.startsWith("@")) {
                              setUsername(e.target.value.slice(1) );
                            }
                          }} />
                          
                          {errors.username ? (
                              <div className="sanitise-oxen">
                                  <BsExclamationCircleFill />
                                  {errors.username}
                              </div>
                          ) : undefined}
                      </div>
                      <div className="spastics-foe">
                          <span>Pseudo</span>
                          <input className={errors.surname ? "error" : undefined} value={surname} 
                          onChange={(e) => { setSurname(e.target.value); }} />
                          
                          {errors.surname ? (
                              <div className="sanitise-oxen">
                                  <BsExclamationCircleFill />
                                  {errors.surname}
                              </div>
                          ) : undefined}
                      </div>
                      <div className="spastics-foe">
                          <span>Mot de passe</span>
                          <input
                              className={passwordHidden.password && errors.password ? "eastern-memo error" : (passwordHidden.password ? "eastern-memo" : undefined)} 
                              type={passwordHidden.password ? "password" : "text"} 
                              value={password} 
                              onChange={e => setPassword(e.target.value)} 
                          />
                          <div className="praised-yald">
                              {passwordHidden.password ? <FaRegEye onClick={() => setPasswordHidden(prev => {
                                  return {...prev, password: false}
                              })} /> : <FaRegEyeSlash onClick={() => setPasswordHidden(prev => {
                                  return {...prev, password: true}
                              })}/>}
                          </div>
                          {errors.password ? (
                              <div className="sanitise-oxen">
                                  <BsExclamationCircleFill />
                                  {errors.password}
                              </div>
                          ) : undefined}
                      </div>
                      <div className="spastics-foe">
                          <span>Confirmer le mot de passe</span>
                          <input 
                              className={passwordHidden.confirm && errors.confirmPassword ? "eastern-memo error" : (passwordHidden.confirm ? "eastern-memo" : undefined)}
                              type={passwordHidden.confirm ? "password" : "text"} 
                              value={confirmPassword} 
                              onChange={e => setConfirmPassword(e.target.value)} 
                          />
                          <div className="praised-yald">
                              {passwordHidden.confirm ? <FaRegEye onClick={() => setPasswordHidden(prev => {
                                  return {...prev, confirm: false}
                              })} /> : <FaRegEyeSlash onClick={() => setPasswordHidden(prev => {
                                  return {...prev, confirm: true}
                              })}/>}
                          </div>
                          {errors.confirmPassword ? (
                              <div className="sanitise-oxen">
                                  <BsExclamationCircleFill />
                                  {errors.confirmPassword}
                              </div>
                      ) : undefined}
                      </div>
                  </div> <br></br>
                      <PasswordStrengthBar
                  style={{ width: '100%' }}
                  scoreWordStyle={{ color: '#716E74' }}
                  shortScoreWord="Trop court"
                  scoreWords={['Très Faible', 'Faible', 'Normal', 'Bien', 'Fort']}
                  password={password}
                />   
                  <div className={loading ? "redirection spinner" : "redirection"}>
                      <button onClick={() => handleRegister()}>
                          { loading ? <img src={Spinner} alt="" /> : "Créer un compte"}
                      </button>
                      <div>
                          Vous avez déjà un compte? <span onClick={() => navigate("/login")}>Connexion</span>
                      </div>
                  </div>
                  <div className="domes-pout">
                        <span>En créant un compte Neutrino, vous acceptez nos</span>
                      <span>conditions d'utilisation</span>
                  </div>
              </div>
          </div>
          <ToastContainer />
      </div>
  )
}

export default Register
