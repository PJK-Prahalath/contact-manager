import React, { useState } from "react";
import { useAuth } from "./Contexts/AuthContext";
import { Link } from "react-router-dom";
import './SignUp.css'; // Import the CSS file

export default function SignUp() {
    const { user, setUser, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignUp() {
        await signUp(email, password).then((userCredentials) => {
            setUser(userCredentials.user.uid);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="signup-container"> {/* Add container class */}
            <h1>Register User Here</h1>
            <label>Enter User Email</label>
            <input
                type="email"
                onChange={(element) => setEmail(element.target.value)}
            />
            <label>Enter User Password</label>
            <input
                type="password"
                onChange={(element) => setPassword(element.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
            <button className="existing-user-button">Existing User? <Link to='/login' className="cl">Login</Link></button>
        </div>
    );
}
