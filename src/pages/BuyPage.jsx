import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import coin from "../assets/coin.png";

const sampleItems = [
  { id: 1, name: "50 Coins", price: 5000 },
  { id: 2, name: "10 Coins", price: 1000 },
  { id: 3, name: "1 Coins", price: 100 },
];

export default function BuyPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.uid;
        const userRef = doc(db, user.displayName, userID);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserData(docSnapshot.data().walletAddress);
              fetchUserBalance(docSnapshot.data().walletAddress);
            } else {
              console.log("User not found.");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        console.log("Error: No user");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserBalance = async (userAddress) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/fetchBalance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: userAddress }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance);
      } else {
        console.error("Error fetching balance:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleBuy = async (item) => {
    try {
      const buyResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/buyCoins`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: userData,
            amount: item.price / 100,
          }),
        }
      );

      if (buyResponse.ok) {
        navigate("/buy/success");
      } else {
        console.error("Error buying item:", buyResponse.statusText);
      }
    } catch (error) {
      console.error("Error buying item:", error);
    }
  };

  if (userBalance === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-2/3">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Buy Coins</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sampleItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-600 rounded-lg p-6 shadow-md flex flex-col justify-between"
            >
              <h2 className="text-xl text-gray-50 flex items-center font-semibold mb-2">
                <img src={coin} className="h-9 w-9 mr-2" />
                {item.name}
              </h2>
              <p className="text-gray-50 mb-2">Price: ₹{item.price}</p>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                onClick={() => handleBuy(item)}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
