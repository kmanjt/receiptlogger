import React, { useEffect, useState } from "react";
import axios from "axios";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/receipts/all")
      .then((response) => {
        setReceipts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {receipts.map((receipt) => (
        <div key={receipt.id}>
          <h3>{receipt.person_name}</h3>
          <p>{receipt.person_email}</p>
          <p>{receipt.total_amount}</p>
          <p>{receipt.date}</p>
          <img src={receipt.image_url} alt={receipt.image_name} />
        </div>
      ))}
    </div>
  );
};

export default Receipts;
