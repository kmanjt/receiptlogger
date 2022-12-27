import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../hocs/AuthContext";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  let navigate = useNavigate();
  let { contextData } = useContext(AuthContext);
  let { user, authTokens, logoutUser } = contextData;

  // add the access token to the request header
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + authTokens.access;

  // call a function conditionally if the user is an admin
  if (user.is_staff) {
    // call a function to get all receipts
  } else {
    // call a function to get the receipts of the logged in user
  }

  let getAdminReceipts = async () => {
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
    }
  };

  let getReceipts = async () => {
    let response = await fetch("/receipts/admin/", {
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

      alert("Receipt upload failed, logged out.");
    }
  };

  // update the receipts when the page loads
  useEffect(() => {
    if (user.is_staff) {
      getAdminReceipts();
    } else {
      getReceipts();
    }
  }, []);

  const handleStatusChange = (event, receiptId) => {
    // Send a request to update the status of the receipt
    axios
      .patch(`/receipts/update_receipt_status/${receiptId}/`, {
        status: event.target.value,
      })
      .then((response) => {
        alert("Receipt status updated successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="grid grid-cols-3 gap-4 py-16">
      {receipts.map((receipt) => (
        <div key={receipt.id} className="card border-black border-[1px]">
          <h3>{receipt.username}</h3>
          <p>{receipt.email}</p>
          <p>{receipt.total_amount}</p>
          <p>{receipt.reason}</p>
          <p>{receipt.date}</p>
          <img src={receipt.image} className="h-64" alt="receipt" />
          <form>
            <>
              {user.admin && (
                <label>
                  Status:
                  <select
                    value={receipt.status}
                    onChange={(event) => handleStatusChange(event, receipt.id)}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="approved">Approved</option>
                  </select>
                </label>
              )}
            </>
          </form>
        </div>
      ))}
    </div>
  );
};

export default Receipts;
