import React, { useState, useEffect, createContext } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const navigate = useNavigate();

  let loginUser = async (e, username, password) => {
    e.preventDefault();

    let response = await fetch("/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    let data = await response.json();
    console.log(data);
    console.log("response:", response);

    if (response.status === 200) {
      // set the token in local storage
      localStorage.setItem("authTokens", JSON.stringify(data));
      // set the token in state
      setAuthTokens(data);
      // set the authenticated state to true
      setAuthenticated(true);
      // set the user state to the access token
      setUser(jwt_decode(data.access));
      // redirect to the home page
      navigate("/");
    } else {
      setAuthenticated(false);
      setUser(null);
      alert("Something went wrong. Please try again.");
    }
  };

  let contextData = {
    user: user,
    loginUser: loginUser,
  };

  useEffect(() => {
    // Check if the user is logged in
    // If they are, set authenticated to true
    // If they are not, set authenticated to false
    // Set loading to false
  }, []);

  return (
    <AuthContext.Provider value={{ contextData }}>
      {children}
    </AuthContext.Provider>
  );
};
