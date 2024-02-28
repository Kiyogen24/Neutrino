import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const getUser = async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );}
    getUser();
  }, []);
  return (
    <Container>

      <h1>
        Bienvenue, <span>{userName}!</span>
      </h1>
      <h3>Séléctionnez une discussion pour commencer.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #03045F;
  }
`;
