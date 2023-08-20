import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import coin from "../assets/coin.png";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.uid;
        const userRef = doc(db, user.displayName, userID);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserData(docSnapshot.data());
              fetchBalance(docSnapshot.data().walletAddress);
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

  const fetchBalance = async (walletAddress) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/fetchBalance`,
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
        setBalance(data.balance);
      } else {
        console.error("Error fetching balance:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="border-2 bg-slate-600 shadow-md items-center rounded-md p-8 w-1/3">
        <h1 className="mb-6 text-3xl underline text-center font-semibold text-gray-50">
          Profile
        </h1>
        <div className="space-y-4">
          <div className="flex items-center text-gray-50">
            <p className="font-bold w-1/3">Name:</p>
            <p className="w-2/3">{userData.name}</p>
          </div>
          <div className="flex items-center text-gray-50">
            <p className="font-bold w-1/3">Email:</p>
            <p className="w-2/3">{userData.email}</p>
          </div>
          <div className="flex items-center text-gray-50">
            <p className="font-bold w-1/3">Type:</p>
            <p className="w-2/3">{userData.type}</p>
          </div>
          <div className="flex items-center text-gray-50">
            <p className="font-bold w-1/3">Wallet Address:</p>
            <p className="w-2/3 overflow-ellipsis">
              {userData.walletAddress.slice(0, 10) +
                "......" +
                userData.walletAddress.slice(-8)}
            </p>
          </div>
          <div className="flex items-center text-gray-50">
            <p className="font-bold w-1/3">GCT Balance:</p>
            <div className="flex items-center">
              <img src={coin} alt="Coins" className="h-8 w-8 mr-2" />
              <p>{balance}</p>
            </div>
          </div>
        </div>
        <button
          className="bg-red-500 text-white mt-6 px-4 py-2 rounded hover:bg-red-600"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
