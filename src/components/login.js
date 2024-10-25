import React, { useState } from "react";
import { useAuth } from "./Contexts/AuthContext";
import { Link } from "react-router-dom";
import './login.css'; // Import the CSS file

var mail="";

export default function Login() {
    const { setUser, login } = useAuth();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    async function handleLogIn() {
        await login(email, password).then((result) => {
            setUser(result.user.uid);
            mail=email;
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="login-container"> {/* Added container class */}
            <h1>Login</h1>
            <label>Enter your email</label>
            <input
                type="email"
                onChange={(element) => {
                    setEmail(element.target.value);
                }}
            />
            <label>Enter your password</label>
            <input
                type="password"
                onChange={(element) => {
                    setPassword(element.target.value);
                }}
            />
            <button onClick={handleLogIn}>Click to log in</button>
            <button>New user? <Link to='/signup'>Sign up</Link></button>
        </div>
    );
}
export {mail};
