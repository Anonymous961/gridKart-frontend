import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import coin from "../assets/coin.png";

const sampleItems = [
  { id: 1, name: "Sample Coupon 1", price: 5 },
  { id: 2, name: "Sample Coupon 2", price: 10 },
  { id: 3, name: "Sample Coupon 3", price: 1 },
];

export default function Redeem() {
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

  const handleRedeem = async (item) => {
    try {
      const redeemResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/redeemCoins`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: userData,
            amount: item.price,
          }),
        }
      );

      if (redeemResponse.ok) {
        navigate("/redeem/success");
      } else {
        console.error("Error redeeming coins:", redeemResponse.statusText);
      }
    } catch (error) {
      console.error("Error redeeming coins:", error);
    }
  };

  if (userBalance === null) {
    return <div>Earn some Coins to get Started.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-2/3">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">
          Redeem GCT Coins
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sampleItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-600 rounded-lg p-6 shadow-md flex flex-col justify-between"
            >
              <h2 className="text-xl text-gray-50 font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-50 mb-2">
                Price: 
                <img
                  src={coin}
                  alt="Coins"
                  className="inline-block h-8 w-8 ml-2"
                />
                {item.price} coins
              </p>
              <button
                className={`${
                  item.price > userBalance
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white py-2 rounded-md`}
                onClick={() => handleRedeem(item)}
                disabled={item.price > userBalance}
              >
                {item.price > userBalance ? "Insufficient Coins" : "Redeem"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
