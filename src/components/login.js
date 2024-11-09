import React, { useState } from "react";
import { useAuth } from "./Contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

export let mail = "";

export default function Login() {
    const { setUser, login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    async function handleLogIn() {
        setError("");
        
        if (!email) {
            setError("Email is required.");
            // toast.error("Email is required.");
            return;
        } else if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            // toast.error("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            // toast.error("Password is required.");
            return;
        }

        setLoading(true);  // Start loading

        try {
            const result = await login(email, password);
            setUser(result.user.uid);
            mail = email;
            // toast.success("Login successful!");
            navigate("/home"); // Redirect to the home page after successful login
        } catch (error) {
            setError("Login failed. Please check your email and password.");
            // toast.error("Login failed. Please check your email and password.");
            console.error(error);
        } finally {
            setLoading(false);  // Stop loading
        }
    }

    return (
        <div className="login-container">
            <ToastContainer />
            <h1 id="hh">Login</h1>

            {error && <p className="error-message">{error}</p>}

            <label>Enter your email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>Enter your password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogIn} disabled={loading}>
                {loading ? "Logging..." : "Login"}
            </button>
            <button disabled={loading}>
                New user? <Link to='/signup'>Sign up</Link>
            </button>
        </div>
    );
}
