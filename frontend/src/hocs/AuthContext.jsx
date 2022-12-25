import React, { useState, useEffect, createContext } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const navigate = useNavigate();

  const logoutUser = () => {
    // remove the token from local storage
    localStorage.removeItem("authTokens");
    // set the token in state to null
    setAuthTokens(null);
    // set the authenticated state to false
    setAuthenticated(false);
    // set the user state to null
    setUser(null);
    // redirect to the login page
    navigate("/login");
  };

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

  // function to refresh the token every 4 minutes
  const refreshTokens = async () => {
    if (authTokens) {
      let response = await fetch("/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: authTokens?.refresh,
        }),
      });
      let data = await response.json();

      // if the response is 200, set the new tokens in local storage and state
      if (response.status === 200) {
        // set the token in local storage
        localStorage.setItem("authTokens", JSON.stringify(data));
        // set the token in state
        setAuthTokens(data);
        // set the authenticated state to true
        setAuthenticated(true);
        // set the user state to the access token
        setUser(jwt_decode(data.access));
        // set loading to false
        if (loading) setLoading(false);
      } else {
        logoutUser();
      }
    }
  };

  // refresh the token every 4 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (authTokens) refreshTokens();
    }, 1000 * 60 * 4); // 4 minutes
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  // call refreshToken on first load if auth tokens exist and loading
  useEffect(() => {
    if (authTokens && loading) refreshTokens();
  }, [authTokens, loading]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={{ contextData }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
