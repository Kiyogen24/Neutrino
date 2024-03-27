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

export default function SetAvatar({ onClose }) {
    const divRef = useRef();
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
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

    const setProfilePicture = async () => {
        const user = await JSON.parse(localStorage.getItem("app-user"));

        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatars[selectedAvatar],
        });

        if (data.isSet) {
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem("app-user", JSON.stringify(user));
            navigate("/");
        } else {
            toast.error("Error setting avatar. Please try again.", toastOptions);
        }
    };
    
    const handlePictureUpload = async (event) => {
        // Handle picture upload logic here
        const file = event.target.files[0];
        
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result.split(",")[1];
            
            // Upload the base64 image to the database
            try {
                const response = await axios.post(`${setAvatarRoute}/${userData?._id}`, { image: base64Image }); // Add a check for userData
                // Handle the response from the server
                console.log(response.data);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        };
        
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleClose = () => {
        onClose();
      };

    useEffect(() => {
        const generateAvatar = async () => {
            const data = [];
            setAvatars(data);
            setIsLoading(false);
        };
        generateAvatar();
    }, []);


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
            {isLoading ? (
                <img src={loader} alt="loader" className="loader" />
            ) : (
                <>
                    <div className="title-container">
                        <h3>Pick an Avatar as your profile picture</h3>
                    </div>
                    <div className="avatars">
                        {/* Render avatar options here if needed */}
                    </div>
                    <div className="upload-container">
                        <h3>Upload Avatar</h3>
                        <input type="file" accept="image/*" onChange={handlePictureUpload} />
                    </div>
                    <Logout />
                    <ToastContainer />
                </>
            )}
        </Container>
    );
}


const Container = styled.div`
    position: fixed;
    bottom: 10px; /* Adjust as needed */
    left: 8px; /* Adjust as needed */
    z-index: 9999; /* Ensure it's above other elements */
    padding: 8px;
    background-color: #000;
    color: white;
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

`;
