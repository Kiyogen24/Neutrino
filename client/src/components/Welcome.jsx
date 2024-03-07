import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const user = sessionStorage.getItem("app-user");
      if (!user) {
        setUserName(
          await JSON.parse(localStorage.getItem("app-user")).username
        );
      } else {
        setUserName(await JSON.parse(user).username);
      }
    };
    getUser();
    console.log(userName);
  }, []);

  return (
    <Container>
      <h1>
        Bienvenue, <span>{userName} !</span>
      </h1>
      <h3>Séléctionnez une discussion pour commencer.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;
  background-color: #00000040;
  img {
    height: 20rem;
  }
  span {
    color: #03045f;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
