import React, { createContext, useEffect, useContext, useState } from "react";
import { auth } from "../../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// Signup
async function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Login
async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// Logout
async function logout() {
    return signOut(auth);
}

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Set the user object
                setUser({
                    email: user.email,
                    uid: user.uid,
                    // Include any other properties you need
                });
                navigate("/home");
            } else {
                setUser(null);
                navigate("/login");
            }
        });
        return unsubscribe;
    }, [navigate]);

    const value = {
        user,
        signUp,
        login,
        logout,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
