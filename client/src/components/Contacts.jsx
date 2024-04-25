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
          <h2>Contacts</h2>
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
                  <h4>{contact.surname}</h4>
                  <h6>{'@'+contact.username}</h6>
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
  grid-template-rows: 0% 0% 100% 0%;
  overflow: hidden;
  background-color: white;
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(39, 94, 254, 0.2);
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
      display: none;
      margin-left: 0;
    }
  }
  .separator {
    height: 1px;
    background: #fff;
  }
  .contacts {
    position: fixed;
    top: 0;
    width: 70%;
    left: 80px;
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
      transition: 0.3s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        flex-direction: column;
        align-items: center;
        h4 {
          color: #03045F;
          margin-bottom: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        h6 {
          margin-top: 0.5rem;
          color: rgb(170, 170, 170);
        }
      }
    }
    .contact:hover {
      background-color: hsla(0, 0%, 10%, 0.05);
    }
    .selected {
      transition: 0.5s ease-in-out;
      display: flex;
      align-items: center;
      background-color: #f1f1f1;
      border: 1px solid #275EFE;

      .username {
        margin-bottom: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        h4 {
          color: #275EFE;
          margin-bottom: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
  @media screen and (max-width: 720px) {
    .contacts {
      left: 0;
    }
  }
  @media screen and (max-width: 480px) {
    .contacts {
      left: 0;
    }
  }
`;