import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from "./components/Home";
import AddContact from "./components/AddContact";
import EditContact from "./components/EditContact";
import DeleteContact from "./components/DeleteContact";
import AuthProvider, { useAuth } from "./components/Contexts/AuthContext"; // Import the useAuth hook
import SignUp from "./components/SignUp";
import Login from "./components/login";
import ContactDetails from "./components/ContactDetails";
import Navbar from "./components/Navbar"; // Import the Navbar component

const App = () => {
    const location = useLocation(); // Get the current location
    const { user } = useAuth(); // Access the user from AuthContext

    // Log the current user's email to the console
    if (user) {
        console.log("Current User Email:", user.email);
    } else {
        console.log("No user is currently logged in.");
    }

    // Check if the current path is one where the Navbar should not be displayed
    const shouldShowNavbar = !["/home", "/login", "/signup"].includes(location.pathname);

    return (
        <>
            {shouldShowNavbar && <Navbar />} {/* Show Navbar only if the current path is not home, login, or signup */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/home" element={<Home />} />
                <Route path="/add" element={<AddContact />} />
                <Route path="/edit" element={<EditContact />} />
                <Route path="/delete" element={<DeleteContact />} />
                <Route path="/list" element={<ContactDetails />} />
            </Routes>
        </>
    );
};

function Main() {
    return (
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    );
}

export default Main;
