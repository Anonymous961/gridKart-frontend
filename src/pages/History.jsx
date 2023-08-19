import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [transactions, setTransaction] = useState(null);
  const fetchData = async () => {
    try {
      const data = await axios.post(
        "https://optimal-oyster-central.ngrok-free.app/getTransactions",
        { address: "0xABb2ac2CbF63c1D1304994146e95bD88b4B3f78b" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTransaction(data.data);
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(transactions);
  return (
    <div>
      <h1>Transaction History</h1>
    </div>
  );
}
