import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import coin from "../assets/coin.png";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.uid;
        const userRef = doc(db, user.displayName, userID);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              fetchData(docSnapshot.data().walletAddress);
            } else {
              console.log("User not found.");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            setError("Error fetching user data");
          });
      } else {
        console.log("Error: No user");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async (walletAddress) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/getTransactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: walletAddress }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      } else {
        console.error("Error fetching balance:", response.statusText);
        setError("Error fetching transaction data");
      }
    } catch (err) {
      console.log(err.message);
      setError("Error fetching transaction data");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Transaction History</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Sl. No</th>
            <th className="border p-2">From</th>
            <th className="border p-2">To</th>
            <th className="border p-2">Value</th>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Token Symbol</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                {transaction.from.slice(0, 6) +
                  "......" +
                  transaction.from.slice(-4)}
              </td>
              <td className="border p-2">
                {transaction.to.slice(0, 6) +
                  "......" +
                  transaction.to.slice(-4)}
              </td>
              <td className="border p-2">{transaction.value}</td>
              <td className="border p-2">
                {new Date(
                  parseInt(transaction.timeStamp) * 1000
                ).toLocaleString()}
              </td>
              <td className="border p-2 flex">
                <img src={coin} height="50px" width="50px" alt="Coins" />
                {transaction.tokenSymbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
