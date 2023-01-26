import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../hocs/AuthContext";
import { Checkbox } from "@mui/material";
import { TiArrowUnsorted, TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [sorted, setSorted] = useState(['ascending', 'descending', 'unsorted'])
  let navigate = useNavigate();
  let { contextData } = useContext(AuthContext);
  let { user, authTokens, logoutUser } = contextData;

  // add the access token to the request header
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + authTokens.access;


  let getAdminReceipts = async () => {
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
    }
  };

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

      alert("Receipt upload failed, logged out.");
    }
  };

  // update the receipts when the page loads
  useEffect(() => {
    if (user.admin === true) {
      getAdminReceipts();
    } else {
      getReceipts();
    }
  }, []);

  // reload receipts on 60 second intervals
  useEffect(() => {
    const interval = setInterval(() => {
      if (user.admin === true) {
        getAdminReceipts();
      } else {
        getReceipts();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateAdminNotes = (event, receiptId) => {
    axios
      .patch(`/receipts/admin/update-receipt-note/${receiptId}/`, {
        admin_comment: event.target.value,
      })
      .then((response) => {
        getAdminReceipts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStatusChange = (event, receiptId) => {
    // Send a request to update the status of the receipt
    axios
      .patch(`/receipts/update_receipt_status/${receiptId}/`, {
        status: event.target.value,
      })
      .then((response) => {
        getAdminReceipts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // send a patch request to update the receipt reimbursement status
  const handleReimbursementStatusChange = (event, receiptId) => {
    axios
      .patch(`/receipts/admin/set-reimbursed/${receiptId}/`, {
        reimbursed: event.target.checked,
      })
      .then((response) => {
        getAdminReceipts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // send a request to sort receipts by date
  const handleSort = () => {
    if (!sorted) {
      axios
        .get("/receipts/admin/sort_by_date/")
        .then((response) => {
          setReceipts(response.data);
          setSorted(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      getAdminReceipts();
      setSorted(false);
    }
  };

  return (
    <>
    <div className="container mx-auto px-4 m-auto pt-16">
      <p className="text-md font-bold mb-4">Sort By Date
      {!sorted ? (
        <TiArrowUnsorted
          className="text-2xl text-gray-600 cursor-pointer inline"
          onClick={handleSort}
        />
      ) : (
        <TiArrowSortedUp
          className="text-2xl text-black cursor-pointer transform inline rotate-180"
          onClick={handleSort}
        />
      )}
      </p>
    </div>
    
    <div className="sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
      {receipts.map((receipt) => (
        <div key={receipt.id} className="bg-white rounded shadow-2xl p-6">
          <div className="flex items-center mb-4">
            
            <h3 className="text-2xl font-bold mr-2">{receipt.username}</h3>
            <p className="text-xs lg:text-sm font-medium text-gray-600">
              {receipt.email}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-xl font-bold mb-2">
              Total Amount: {receipt.total_amount}
            </p>
            <p className="text-base font-medium mb-2">
              Reason: {receipt.reason}
            </p>
            <p className="text-base font-medium mb-2">Date: {receipt.date}</p>
            <p className="text-xs font-medium mb-2">IBAN: {receipt.iban}</p>

            {receipt.status === "pending" && (
              <p className="text-base font-medium mb-2 text-yellow-500 uppercase">
                {receipt.status}
              </p>
            )}
            {receipt.status === "rejected" && (
              <p className="text-base font-medium mb-2 text-red-500 uppercase">
                {receipt.status}
              </p>
            )}
            {receipt.status === "approved" && (
              <p className="text-base font-medium mb-2 text-green-500 uppercase">
                {receipt.status}
              </p>
            )}
            <p className="text-xs font-medium mb-2">
              Reimbursed: {receipt.reimbursed ? "Yes" : "No"}
            </p>
          </div>
          <div className="mb-4">
            <img
              src={receipt.image}
              className="h-48 object-cover rounded"
              alt="receipt"
            />
          </div>
          {user.admin && (
            <form>
              <label className="block font-medium text-sm mb-2">
                Status:
                <select
                  value={receipt.status}
                  onChange={(event) => handleStatusChange(event, receipt.id)}
                  className="form-select w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <label className="block font-medium text-sm mb-2">
                Reimbursed:
                <Checkbox
                  checked={receipt.reimbursed}
                  onChange={(event) =>
                    handleReimbursementStatusChange(event, receipt.id)
                  }
                />
              </label>
              <label className="block font-medium text-sm mb-2">
                Admin Comment
                <textarea
                  value={receipt.admin_comment}
                  className="form-textarea w-full border-gray-500 rounded-md shadow-sm"
                  onChange={(event) =>
                  updateAdminNotes(event, receipt.id)
                }
                />
              </label>
       
              
            </form>
          )}
        </div>
      ))}
    </div>
    </>
  );
};

export default Receipts;
