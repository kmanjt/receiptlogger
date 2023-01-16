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
      resetForms();
      return;
    }
    if (iban !== confirmIban) {
      // Display error message if IBANs do not match
      alert("IBANs do not match");
      resetForms();
      return;
    }
    if (username.length < 3) {
      alert("Username must be at least 3 characters long");
      resetForms();
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
    <form className="bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
      <label className="block font-medium text-gray-700 mb-2" htmlFor="username">Username:</label>
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="text"
        id="username"
        value={username}
        required={true}
        onChange={(event) => setUsername(event.target.value)}
      />
      <br />
      <label className="block font-medium text-gray-700 mb-2" htmlFor="email">Email:</label>
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="email"
        id="email"
        value={email}
        required={true}
        onChange={(event) => setEmail(event.target.value)}
      />
      <br />
      <label className="block font-medium text-gray-700 mb-2" htmlFor="password">Password:</label>
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="password"
        id="password"
        value={password}
        required={true}
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />
      <label className="block font-medium text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password:</label>
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        required={true}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
      <br />
      <label className="block font-medium text-gray-700 mb-2" htmlFor="iban">IBAN:</label>
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="text"
        id="iban"
        value={iban}
        required={true}
        onChange={(event) => setIban(event.target.value)}
      />
      <br />
      <label className="block font-medium text-gray-700 mb-2" htmlFor="confirmIban">Confirm IBAN:</label>
      <input
        className="border border-gray-400 p-2 rounded w-full"
        type="text"
        id="confirmIban"
        value={confirmIban}
        required={true}
        onChange={(event) => setConfirmIban(event.target.value)}
      />
      <br />
      <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 mt-4" type="submit">Register</button>
    </form>
  );
};

export default Register;
