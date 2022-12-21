import React, { useState } from "react";
import axios from "axios";
import Receipts from "./Receipts";

const ReceiptSubmit = () => {
  const [personName, setPersonName] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      person_name: personName,
      person_email: personEmail,
      total_amount: totalAmount,
      date: date,
      image: imageBase64,
      image_name: imageName,
    };

    axios
      .post("http://localhost:8000/receipts/create_receipt/", data)
      .then((response) => {
        console.log(response.message);
        alert("Receipt successfully uploaded");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Person Name:
          <input
            type="text"
            value={personName}
            onChange={(event) => setPersonName(event.target.value)}
          />
        </label>
        <br />
        <label>
          Person Email:
          <input
            type="email"
            value={personEmail}
            onChange={(event) => setPersonEmail(event.target.value)}
          />
        </label>
        <br />
        <label>
          Total Amount:
          <input
            type="number"
            value={totalAmount}
            onChange={(event) => setTotalAmount(event.target.value)}
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <br />
        <label>
          Image:
          <input
            type="file"
            onChange={(event) => {
              setImage(event.target.files[0]);
              setImageName(event.target.files[0].name);
              const reader = new FileReader();
              reader.readAsDataURL(event.target.files[0]);
              // below is changing the image to base64
              reader.onloadend = () => {
                setImageBase64(reader.result);
              };
            }}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
      <Receipts />
    </>
  );
};

export default ReceiptSubmit;
