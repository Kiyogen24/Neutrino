import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatRoute } from "../utils/APIRoutes";

const Chat = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        axios.get("/api/checkLoggedIn")
            .then(response => {
                if (response.data.loggedIn) {
                    setLoggedIn(true);
                } else {
                    navigate("/register");
                }
            })
            .catch(error => {
                console.error("Error checking login status:", error);
                toast.error("An error occurred while checking login status.");
            });
    }, []);

    return (
        <div>
            {loggedIn ? (
                <h1>Welcome to the chat!</h1>
                // Add chat components here
            ) : (
                <p>Please <Link to="/register">register</Link> to access the chat.</p>
            )}
            <ToastContainer />
        </div>
    );
}

export default Chat;