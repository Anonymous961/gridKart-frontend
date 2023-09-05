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
    <div className="p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Transaction History
      </h1>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3">Sl. No</th>
            <th className="border p-3">From</th>
            <th className="border p-3">To</th>
            <th className="border p-3">Value</th>
            <th className="border p-3">Timestamp</th>
            <th className="border p-3">Token Symbol</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="border p-3">{index + 1}</td>
              <td className="border p-3">
                {transaction.from.slice(0, 6) +
                  "......" +
                  transaction.from.slice(-4)}
              </td>
              <td className="border p-3">
                {transaction.to.slice(0, 6) +
                  "......" +
                  transaction.to.slice(-4)}
              </td>
              <td className="border p-3">{transaction.value}</td>
              <td className="border p-3">
                {new Date(
                  parseInt(transaction.timeStamp) * 1000
                ).toLocaleString()}
              </td>
              <td className="border p-3 flex items-center">
                <img src={coin} alt="Coins" className="h-8 w-8 mr-2" />
                {transaction.tokenSymbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
