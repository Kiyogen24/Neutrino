import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import Logout from "./Logout";

export default function SetAvatar({ onClose, ChangePP }) {
    const divRef = useRef();
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSet, setIsSet] = useState(false);
    const [userData, setUserData] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };

    useEffect(() => {
        const verif = async () => {
            let user = localStorage.getItem("app-user");
            if (!user) {
                user = sessionStorage.getItem("app-user");
            }
            if (!user) {
                navigate("/login");
            }
            setUserData(JSON.parse(user));
        };
        verif();
    }, []);

    useEffect(() => {
        const setProfilePicture = async () => {
            const user = userData;

            try {
                user.avatarImage = avatar;
                localStorage.setItem("app-user", JSON.stringify(user));
                setIsSet(true);
                ChangePP(avatar);
                navigate("/");
            } catch (error) {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        };

        if (avatar) {
            setProfilePicture();
        }
    }, [avatar]);

    const handlePictureUpload = async (event) => {
        // Handle picture upload logic here

        const imageFile = event.target.files[0];

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result.split(",")[1];

            // Upload the base64 image to the database
            try {
                const response = await axios.post(`${setAvatarRoute}/${userData?._id}`, { image: base64Image }); // Add a check for userData
                // Handle the response from the server
                setAvatar(response.data.image);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        }
    };

    const handleClose = () => {
        onClose();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (divRef.current && !divRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <Container ref={divRef}>
            <>
                <div className="title-container">
                    <h3>Changer de photo de profil</h3>
                </div>
                <div className="upload-container">
                    <div className="button-container">
                        <label htmlFor="upload-button">Choisir</label>
                        <input id="upload-button" type="file" accept="image/*" onChange={handlePictureUpload} />
                    </div>
                    {isSet && <img className="avatar-image" src={`data:image/*;base64, ${avatar}`} />}
                </div>
                <br/><br/>
                <Logout />
                <ToastContainer />
            </>
        </Container>
    );
}

const Container = styled.div`
    position: fixed;
    bottom: 10px;
    left: 8px;
    z-index: 9999;
    padding: 18px;
    background-color: white;
    backdrop-filter: blur(8px);
    border: 1px solid lightgrey;
    color: #03045F;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

    animation: fadeFromBottom 0.1s ease-in-out;

    @keyframes fadeFromBottom {
        0% {
            opacity: 0;
            transform: translateY(100%);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .button-container {
        margin-top: 20px;
    }
    .upload-container {
        gap: 1rem;
        display: flex;
        align-items: center;
    }


    label {
        width: 350px;
        max-width: 100%;
        color: #222245;
        padding: 8px;
        background-color: #fff;
        border: 1px solid #222245;
        margin: 12px;
      }
      
      label:focus {
        outline: 2px dashed #222245;
        outline-offset: 2px;
      }
      
      label {
        margin-right: 8px;
        border-radius: 10px;
        border: none;
        background: #222245;
        padding: 8px 12px;
        color: #fff;
        cursor: pointer;
      }
      
      label:hover {
        background: #4747b8;
      }
      input[type=file] {
        display: none;
      }
      .avatar-image {
        object-fit: cover;
        border-radius: 50%;
        width: 100px;
        height: 100px;
    }
      `;
