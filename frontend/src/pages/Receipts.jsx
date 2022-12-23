import React, { useEffect, useState } from "react";
import axios from "axios";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    axios
      .get("/receipts/all/")
      .then((response) => {
        setReceipts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
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
