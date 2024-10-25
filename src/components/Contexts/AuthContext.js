import React from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext } from "react";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext) // obj = useContext(AuthContext)// obj.value.user
}




//signup
async function signUp(email, password){

    return new Promise(async (resolve, reject) => {

        await createUserWithEmailAndPassword(auth, email, password).then((userCredentials)=>{
            resolve(userCredentials);
        }).catch((error)=>{
            reject(error)
        })
    })
}

//login 
async function login(email, password){
    return new Promise(async (resolve, reject)=> {
        await signInWithEmailAndPassword(auth, email, password).then((userCredentials)=>{
            resolve(userCredentials);
        }).catch((error)=>{
            reject(error);
        })
    })
}

async function logout(){
    return new Promise(async (resolve, reject)=> {
        await signOut(auth).then(()=>{
            resolve("signed out successfully")
        }).catch((error)=>{
            reject("error signing out");
        })
        })
    }


export default function AuthProvider({children}){
    const navigate = useNavigate();
    
    useEffect(()=> {
     const kill = onAuthStateChanged(auth, (user)=> {
        if(user){
            navigate('/home');
        }
        else{
            navigate('/login');
        }
      })
      return kill;
    },[])
    
    const [user, setUser] = useState('prahalath');
    const value = {
        user,
        setUser,
        signUp,
        login,
        logout
    }
    return (    
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

    );
}
