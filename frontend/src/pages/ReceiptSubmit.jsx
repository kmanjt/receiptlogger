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

    // reset the form
    setTotalAmount("");
    setDate("");
    setImage("");
    setImageName("");
    setImageBase64("");
    setReason("");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full flex-col"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
            htmlFor="total-amount"
          >
            Total Amount:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="total-amount"
            type="number"
            value={totalAmount}
            onChange={(event) => setTotalAmount(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
            htmlFor="date"
          >
            Date:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            value={date}
            required={true}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 w-full"
            htmlFor="reason"
          >
            Reason:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="reason"
            type="text"
            value={reason}
            required={true}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-
          2 w-full"
            htmlFor="image"
          >
            Image:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              setImage(event.target.files[0]);
              setImageName(event.target.files[0].name);
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageBase64(reader.result);
              };
              reader.readAsDataURL(event.target.files[0]);
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>

      <Receipts />
    </>
  );
};

export default ReceiptSubmit;
