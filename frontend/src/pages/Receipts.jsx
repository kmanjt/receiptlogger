import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../hocs/AuthContext";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  let navigate = useNavigate();
  let { contextData } = useContext(AuthContext);
  let { user, authTokens, logoutUser } = contextData;

  let getReceipts = async () => {
    let response = await fetch("/receipts/all/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authTokens.access,
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setReceipts(data);
    } else if (response.status === 401) {
      // remove the token from local storage
      logoutUser();
      // redirect to the login page
      navigate("/login");
    }
  };

  useEffect(() => {
    getReceipts();
  }, []);

  const handleStatusChange = (event, receiptId) => {
    // Send a request to update the status of the receipt
    axios
      .patch(`/receipts/update_receipt_status/${receiptId}/`, {
        status: event.target.value,
      })
      .then((response) => {
        console.log(response.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {receipts.map((receipt) => (
        <div key={receipt.id}>
          <h3>{receipt.person_name}</h3>
          <p>{receipt.person_email}</p>
          <p>{receipt.total_amount}</p>
          <p>{receipt.date}</p>
          <img src={receipt.image_url} alt={receipt.image_name} />
          <form>
            <label>
              Status:
              <select
                value={receipt.status}
                onChange={(event) => handleStatusChange(event, receipt.id)}
              >
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="approved">Approved</option>
              </select>
            </label>
          </form>
        </div>
      ))}
    </div>
  );
};

export default Receipts;
