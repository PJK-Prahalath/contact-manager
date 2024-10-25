import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'; 
import { useAuth } from "./Contexts/AuthContext";

function Home() {
  const navigate = useNavigate();
  const {user, setUser, signUp, login, logout} = useAuth();
  console.log(user);

  async function handleLogOut(){
    await logout().then((result)=>{
      console.log("user logged out successfully");
    }).catch((error)=>{
      console.log(error);
    })
  }
  return (
    <div className="home-container">
      <h1>Contact Manager</h1>
      <div className="button-container">
        <button className="home-button" onClick={() => navigate("/add")}>Add Contact</button>
        <button className="home-button" onClick={() => navigate("/edit")}>Edit Contact</button>
        <button className="home-button" onClick={() => navigate("/delete")}>Delete Contact</button>
        <button className="home-button" onClick={() => navigate("/list")}>Contact List</button>
        <button className="home-button" onClick={handleLogOut}>Log out</button>
      </div>
    </div>
  );
}

export default Home;