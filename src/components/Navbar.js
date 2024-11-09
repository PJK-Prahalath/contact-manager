import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";

import { useAuth } from './Contexts/AuthContext'; // Make sure the path is correct
import './Navbar.css'; // Import the CSS for the navbar
import { mail } from './login';


const Navbar = () => {
    console.log(mail);
    const { user } = useAuth(); // Get the current user from AuthContext

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/home" className="nav-item" >Home</NavLink>
                <NavLink to="/add" className="nav-item" >Add Contact</NavLink>
                <NavLink to="/edit" className="nav-item">Edit Contact</NavLink>
                <NavLink to="/delete" className="nav-item">Delete Contact</NavLink>
                <NavLink to="/list" className="nav-item">Contact List</NavLink>
                <NavLink to="/login" className="nav-item">Logout</NavLink>

                {/* Display user's email */}
                <span className="nav-item mail">{mail}</span>
            </div>
        </nav>
    );
};

export default Navbar;
