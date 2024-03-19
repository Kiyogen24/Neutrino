import React, { useState, useEffect, Suspense } from "react";
import { createGroupRoute } from "../utils/APIRoutes";
import axios from "axios";
import styled from "styled-components";
import { toast, ToastContainer } from 'react-toastify';
import { FaRegSquarePlus } from "react-icons/fa6";
import Logo from "../assets/neutrino.png"

export default function GroupContacts({ contacts, groups, changeGroup }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [groupName, setGroupName] = useState(undefined);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [data, setData] = useState(undefined);
  const [showChooseMembers, setShowChooseMembers] = useState(false); // Add state for showing/hiding the choose members div
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };


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

  const changeCurrentGroupChat = (index, group) => {
    setCurrentSelected(index);
    changeGroup(group);
  };

  const handleChooseMembers = () => {
    setShowChooseMembers(true); // Show the choose members div
  };
  const handleCheckboxChange = (contact, isChecked) => {
    if (isChecked) {
      setSelectedContacts(prevContacts => [...prevContacts, contact]);
    } else {
      setSelectedContacts(prevContacts => prevContacts.filter(c => c._id !== contact._id));
    }
  };

  const handleSubmitGroup = async (e) => {
    e.preventDefault();
    // Logic to create a group with selected members
    // You can access the selected members from the state or any other source
    // Perform the necessary actions to create the group
    if (selectedContacts.length === 0) {
      e.preventDefault();
      toast.error("Séléctionnez au moins une personne pour créer un groupe.", toastOptions);
      return; // Exit the function to prevent further execution
    }

    if (!groupName) {
      e.preventDefault();
      toast.error("Veuillez entrer un nom de groupe.", toastOptions);
      return; // Exit the function to prevent further execution
    }

    // Create the group object
    const group = {
      name: groupName,
      admin: data._id,
      members: selectedContacts.map(contact => contact._id),
      // Add any other properties you want to include in the group object
    };
    try {
      // Make an API call or a database query to create the group
      // For example, using axios to make a POST request to an API endpoint
      const response = await axios.post(`${createGroupRoute}`, group);
      // Handle the response as needed
    } catch (error) {
      alert(error);
      console.error(error); // Handle the error
    }
    setShowChooseMembers(false); // Hide the choose members div after submitting
    console.log(selectedContacts);
    setSelectedContacts([]); // Clear the selectedContacts state
  };

  return (
    <>
      <Container>
        <div className="brand">
          <button onClick={handleChooseMembers}><FaRegSquarePlus/></button>
        </div>
        <div className="separator"></div>
        <div className="groups">
          {Array.isArray(groups) && groups.map((group, index) => {
            return (
              <div
                key={group._id}
                className={`group ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentGroupChat(index, group)}
              >
                <div className="username">
                  <h3>{group.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
        {showChooseMembers && (
          <form className="choose-members">
            <button onClick={() => setShowChooseMembers(false)} className="exit"></button>
            <input placeholder="Nom du groupe" onChange={e => setGroupName(e.target.value)} />
            <div className="choose-members-container">
              {contacts.map((contact, index) => {
                return (
                  <div key={contact._id} className="checkbox-wrapper-13">
                    <label htmlFor="c1-13">{"@" + contact.username}</label>
                    <input id="c1-13" 
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(contact, e.target.checked)}
                      />
                  </div>
                );
              })}
            </div>
            <button className="createGroup" onClick={handleSubmitGroup}>Submit</button>
          </form>
        )}
        {/*
        <div className="current-user">
          <div className="avatar"></div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
        </div>
            */}
            <ToastContainer />
      </Container>
    </>
  );
}



const Container = styled.div`
  display: grid;
  rezise: horizontal;
  grid-template-rows: 9% 1% 90% 0%;
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
  .choose-members {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    z-index: 999;
    width: 50%;
    height: 80%;
    padding: 2rem;
    border-radius: 1rem;
    backdrop-filter: blur(8px);
    overflow-y: auto;
  }
  .brand button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  // Submit button
  .createGroup {
    background-color: #4db6c4;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .createGroup:hover {
    background-color: #3a9ca6;
  }
.exit {
  position: absolute; /* Add this line to make the position absolute */
  top: 0.5rem; /* Adjust the top position as needed */
  right: 0.5rem; /* Adjust the right position as needed */
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.exit::before,
.exit::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1.5rem;
  height: 0.2rem;
  background-color: white;
}

.exit::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.exit::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

  .choose-members-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    flex-direction: row;
  }
  .separator {
    height: 1px;
    background: #101010;
  }

  @supports (-webkit-appearance: none) or (-moz-appearance: none) {
    .checkbox-wrapper-13 input[type=checkbox] {
      --active: #275EFE;
      --active-inner: #fff;
      --focus: 2px rgba(39, 94, 254, .3);
      --border: #BBC1E1;
      --border-hover: #275EFE;
      --background: #fff;
      --disabled: #F6F8FF;
      --disabled-inner: #E1E6F9;
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 21px;
      outline: none;
      display: inline-block;
      vertical-align: top;
      position: relative;
      margin: 0;
      cursor: pointer;
      border: 1px solid var(--bc, var(--border));
      background: var(--b, var(--background));
      transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
    }
    .checkbox-wrapper-13 input[type=checkbox]:after {
      content: "";
      display: block;
      left: 0;
      top: 0;
      position: absolute;
      transition: transform var(--d-t, 0.3s) var(--d-t-e, ease), opacity var(--d-o, 0.2s);
    }
    .checkbox-wrapper-13 input[type=checkbox]:checked {
      --b: var(--active);
      --bc: var(--active);
      --d-o: .3s;
      --d-t: .6s;
      --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
    }
    .checkbox-wrapper-13 input[type=checkbox]:disabled {
      --b: var(--disabled);
      cursor: not-allowed;
      opacity: 0.9;
    }
    .checkbox-wrapper-13 input[type=checkbox]:disabled:checked {
      --b: var(--disabled-inner);
      --bc: var(--border);
    }
    .checkbox-wrapper-13 input[type=checkbox]:disabled + label {
      cursor: not-allowed;
    }
    .checkbox-wrapper-13 input[type=checkbox]:hover:not(:checked):not(:disabled) {
      --bc: var(--border-hover);
    }
    .checkbox-wrapper-13 input[type=checkbox]:focus {
      box-shadow: 0 0 0 var(--focus);
    }
    .checkbox-wrapper-13 input[type=checkbox]:not(.switch) {
      width: 21px;
    }
    .checkbox-wrapper-13 input[type=checkbox]:not(.switch):after {
      opacity: var(--o, 0);
    }
    .checkbox-wrapper-13 input[type=checkbox]:not(.switch):checked {
      --o: 1;
    }
    .checkbox-wrapper-13 input[type=checkbox] + label {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      margin-left: 4px;
    }

    .checkbox-wrapper-13 input[type=checkbox]:not(.switch) {
      border-radius: 7px;
    }
    .checkbox-wrapper-13 input[type=checkbox]:not(.switch):after {
      width: 5px;
      height: 9px;
      border: 2px solid var(--active-inner);
      border-top: 0;
      border-left: 0;
      left: 7px;
      top: 4px;
      transform: rotate(var(--r, 20deg));
    }
    .checkbox-wrapper-13 input[type=checkbox]:not(.switch):checked {
      --r: 43deg;
    }
  }

  .checkbox-wrapper-13 * {
    box-sizing: inherit;
  }
  .checkbox-wrapper-13 *:before,
  .checkbox-wrapper-13 *:after {
    box-sizing: inherit;
  }
  .groups {
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
    .group {
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
      }
    }
    .group:hover {
      background-color: #303030ef;
    }
    .selected {
      transition: 0.5s ease-in-out;
      background: #404040ef;
      display: flex;
      align-items: center;
      .username {
        h3 {
          background: -webkit-linear-gradient(to bottom, #fff, #00B6DA);
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
