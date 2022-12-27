import React, { useState, useContext } from "react";
import axios from "axios";
import Receipts from "./Receipts";
import AuthContext from "../hocs/AuthContext";

const ReceiptSubmit = () => {
  const [totalAmount, setTotalAmount] = useState("");

  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [reason, setReason] = useState("");

  let { contextData } = useContext(AuthContext);
  let { user, authTokens } = contextData;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (image === "") {
      alert("Please upload an image");
      return;
    }
    if (totalAmount === "" || totalAmount < 0) {
      alert("Please enter a valid total amount");
      return;
    }
    const data = {
      username: user.username,
      email: user.email,
      total_amount: totalAmount,
      date: date,
      image: imageBase64,
      image_name: imageName,
      iban: user.iban,
      reason: reason,
    };

    // axios post request same as above which also uses a header to send the token
    axios
      .post("receipts/create_receipt/", data, {
        headers: {
          Authorization: "Bearer " + authTokens.access,
        },
      })
      .then((response) => {
        alert("Receipt successfully uploaded");
      })
      .catch((error) => {
        alert("Receipt upload failed", error.message);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
            required={true}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <br />
        <label>
          Reason:
          <input
            type="text"
            value={reason}
            required={true}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <br />
        <label>
          Image:
          <input
            type="file"
            onChange={(event) => {
              // validate if the image is less than 2MB
              if (event.target.files[0].size > 2000000) {
                alert("Image size is too large! Max is 2MB.");
                return;
              }
              // validate if the image is a jpg or png
              if (
                event.target.files[0].type !== "image/jpeg" &&
                event.target.files[0].type !== "image/png"
              ) {
                alert("Image type is not supported, must be jpg or png.");
                return;
              }
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

        {user && <input type="submit" value="Submit" />}
      </form>
      <Receipts />
    </>
  );
};

export default ReceiptSubmit;
