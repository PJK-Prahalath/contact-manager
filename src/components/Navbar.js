import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext'; // Make sure the path is correct
import './Navbar.css'; // Import the CSS for the navbar
import { mail } from './login';

const Navbar = () => {
    console.log(mail);
    const { user } = useAuth(); // Get the current user from AuthContext

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="nav-item">Home</Link>
                <Link to="/add" className="nav-item">Add Contact</Link>
                <Link to="/edit" className="nav-item">Edit Contact</Link>
                <Link to="/delete" className="nav-item">Delete Contact</Link>
                <Link to="/list" className="nav-item">Contact List</Link>
                <Link to="/login" className="nav-item">Logout</Link>

                {/* Display user's email */}
                <span className="nav-item mail">{mail}</span>
            </div>
        </nav>
    );
};

export default Navbar;
