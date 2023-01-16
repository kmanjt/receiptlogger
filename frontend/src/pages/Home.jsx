import React, { useContext } from "react";
import AuthContext from "../hocs/AuthContext";

const Home = () => {
  const { contextData } = useContext(AuthContext);
  const { user } = contextData;

  return <div>Welcome to the Enactus DCU Treasury Home {user?.username}!</div>
};

export default Home;
