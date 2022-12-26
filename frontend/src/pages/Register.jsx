import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [iban, setIban] = useState("");
  const [confirmIban, setConfirmIban] = useState("");

  const navigate = useNavigate();

  // reset all forms if there is an error
  const resetForms = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIban("");
    setConfirmIban("");
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate form input
    if (password !== confirmPassword) {
      // Display error message if passwords do not match
      alert("Passwords do not match");
      return;
    }
    if (iban !== confirmIban) {
      // Display error message if IBANs do not match
      alert("IBANs do not match");
      return;
    }
    if (username.length < 3) {
      alert("Username must be at least 3 characters long");
      return;
    }

    // Send a request to the server to register the user
    fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        iban: iban,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display error message if registration fails
        if (data.error) {
          alert(data.error);
        } else {
          // Redirect to the home page if registration succeeds
          alert("Registration successful, please log in");
          navigate("/login");
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        required={true}
        onChange={(event) => setUsername(event.target.value)}
      />
      <br />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        required={true}
        onChange={(event) => setEmail(event.target.value)}
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        required={true}
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />
      <label htmlFor="confirmPassword">Confirm Password:</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        required={true}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
      <br />
      <label htmlFor="iban">IBAN:</label>
      <input
        type="text"
        id="iban"
        value={iban}
        required={true}
        onChange={(event) => setIban(event.target.value)}
      />
      <br />
      <label htmlFor="confirmIban">Confirm IBAN:</label>
      <input
        type="text"
        id="confirmIban"
        value={confirmIban}
        required={true}
        onChange={(event) => setConfirmIban(event.target.value)}
      />
      <br />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
