import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

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
        const userRef = doc(db, "seller", userID);
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-2/3">
        <h1 className="text-4xl font-bold mb-8">Redeem Items</h1>
        <div className="grid grid-cols-3 gap-4">
          {sampleItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-4 shadow-md flex flex-col justify-between"
            >
              <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
              <p className="mb-2">Price: {item.price} coins</p>
              <button
                className={`${
                  item.price > userBalance
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-500"
                } text-white py-2 rounded-md`}
                onClick={() => handleRedeem(item)}
                disabled={item.price > userBalance}
              >
                {item.price > userBalance ? "Insufficient Coins" : "Buy"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
