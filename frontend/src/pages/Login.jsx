import React, { useState, useContext } from "react";

import AuthContext from "../hocs/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // import loginUser from Context
  let { contextData } = useContext(AuthContext);
  let { loginUser } = contextData;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send a request to the backend to authenticate the user with the provided username and password
    loginUser(event, username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
