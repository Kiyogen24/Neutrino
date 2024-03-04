import React, { useState, useEffect, Suspense } from "react";
import styled from "styled-components";
import Logo from "../assets/neutrino.png"


export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    const fetchUsers = async () => {
      const user = sessionStorage.getItem("app-user");
      if (!user) {
        setData(await JSON.parse(localStorage.getItem("app-user")));
      } else {
        setData(await JSON.parse(user));
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (data) {
      setCurrentUserName(data.surname);
    }
  }, [data]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  
  return (
    <>
      <Container>
        <div className="brand">
          <h2>Neutrino</h2>
        </div>
        <div className="separator"></div>
        <div className="contacts">
          {contacts.map((contact, index) => {
            return (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="username">
                  <h3>{contact.surname}</h3>
                  <h5>{'@'+contact.username}</h5>
                </div>
              </div>
            );
          })}
        </div>
        {/*
        <div className="current-user">
          <div className="avatar"></div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
        </div>
        */}
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  rezise: horizontal;
  grid-template-rows: 0% 1% 100% 0%;
  overflow: hidden;
  background-color: #101010;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;

    h2 {
      background: #03045F; 
      background: -webkit-linear-gradient(to top, #03045F, #00B6DA); 
      background: linear-gradient(to top, #03045F 0%, #00B6DA 85%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-left: 0;
      display: none;
    }
    
  }
  .separator {
    height: 1px;
    background: #101010;
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #4db6c4;
        width: 0.1rem;
      }
    }
    .contact {
      cursor: pointer;
      width: 90%;
      border-radius: 0.6rem;
      padding-left: 0.4rem;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        flex-direction: column;
        align-items: center;
        h3 {
          color: white;
          margin-bottom: 0;
        }
        
        h5 {
          margin-top: 0.5rem;
        }
      }
    }
    .contact:hover {
      background-color: #303030ef;
    }
    .selected {
      transition: 0.5s ease-in-out;
      background: #404040ef;
      display: flex;
      align-items: center;
      
      .username {
        h3 {
          background: -webkit-linear-gradient(to bottom, #ff, #00B6DA); 
          background: linear-gradient(to bottom, #fff 0%, #00B6DA 85%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      }
    }
  }

  .current-user {
    background-color: #101010;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
