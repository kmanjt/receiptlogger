import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../hocs/AuthContext';


const Payments = () => {
  const [payments, setPayments] = useState([]);
  const { contextData } = useContext(AuthContext);
  const { user, authTokens } = contextData;

  // add the access token to the request header
    axios.defaults.headers.common["Authorization"] =
        "Bearer " + authTokens.access;

    let getAdminPayments = async () => {
        let response = await fetch("/receipts/admin/get-total-due/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authTokens.access,
                
            },
        });
        let data = await response.json();
        if (response.status === 200) {
            setPayments(data);
        } else if (response.status === 401) {    
        }
    };

    // call getAdminPayments when the page loads
    useEffect(() => {
        getAdminPayments();
    }, []);

    // call getAdminPayments every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            getAdminPayments();
        }, 60000);
        return () => clearInterval(interval);
    }, []);



  return (
<div className="text-center">
    <h1 className="text-2xl font-medium pt-8">Approved Payments Due (That Have Not Been Reimbursed)</h1>
    <table className="mt-4 w-full text-left table-auto">
        <thead>
            <tr className="bg-gray-200">
                <th className="px-4 py-2">IBAN</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Amount</th>
            </tr>
        </thead>
        <tbody>
            {payments.map((payment, index) => (
                <tr key={index} className="border-t">
                    <td className="px-4 py-2">{payment.iban}</td>
                    <td className="px-4 py-2">{payment.email}</td>
                    <td className="px-4 py-2">{payment.total_due}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

  )
}

export default Payments