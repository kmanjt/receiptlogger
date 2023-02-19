import React, { useContext } from "react";
import AuthContext from "../hocs/AuthContext";
import axios from "axios";

const Home = () => {
  const { contextData } = useContext(AuthContext);
  const { user, authTokens } = contextData;

  axios.defaults.headers.common["Authorization"] =
        "Bearer " + authTokens.access;
    


  return <div className="pt-12">Welcome to the Enactus DCU Treasury Home {user?.username}!</div>
}

export default Home;
