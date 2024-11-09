import React, { useState } from "react";
import { useAuth } from "./Contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './SignUp.css';

export default function SignUp() {
    const { setUser, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);
    const [mailError, setMailError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false); // Loading state

    const navigate = useNavigate();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    async function handleSignUp() {
        setErrorMessage('');
        setHasError(false);
        setMailError(false);
        setPassError(false);

        // Validate email
        if (!email) {
            setErrorMessage("Email is required.");
            setMailError(true);
            return;
        } else if (!emailPattern.test(email)) {
            setErrorMessage("Invalid email address.");
            setMailError(true);
            return;
        }

        // Validate password
        if (!password) {
            setErrorMessage("Password is required.");
            setPassError(true);
            return;
        } else if (password.length < 6) {
            setErrorMessage("Password is less than 6 characters.");
            setPassError(true);
            return;
        }

        setIsSigningUp(true); // Set loading state to true

        // Attempt sign-up
        try {
            const userCredentials = await signUp(email, password);
            setUser(userCredentials.user.uid);
            navigate('/login'); // Redirect to login page after successful sign-up
        } catch (error) {
            console.log(error);
            setErrorMessage("User already exist.");
            setHasError(true);
        } finally {
            setIsSigningUp(false); // Reset loading state
        }
    }

    return (
        <div className="signup-container">
            <h1 id="hh">Register User Here</h1>
            
            {/* Display error message */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            <label>Enter User Email</label>
            <input
                type="email"
                value={email}
                onChange={(element) => setEmail(element.target.value)}
                className={hasError || mailError ? 'error-input' : ''} // Apply error class conditionally
            />

            <label>Enter User Password</label>
            <input
                type="password"
                value={password}
                onChange={(element) => setPassword(element.target.value)}
                className={hasError || passError ? 'error-input' : ''} // Apply error class conditionally
            />

            <button onClick={handleSignUp} disabled={isSigningUp}>
                {isSigningUp ? 'Signing...' : 'Sign Up'}
            </button>
            
            <button className="existing-user-button">Existing User? <Link to='/login' className="cl">Login</Link></button>
        </div>
    );
}
