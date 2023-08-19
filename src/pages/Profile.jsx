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
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 bg-lime-400 rounded-md flex flex-col justify-center items-center p-8 px-20 w-1/3">
        <h1 className="mt-10 text-4xl text-white">Profile</h1>
        <p className="text-white">Name: {userData.name}</p>
        <p className="text-white">Email: {userData.email}</p>
        <p className="text-white">Type: {userData.type}</p>
        <p className="text-white">Wallet Address: {userData.walletAddress}</p>
        <p className="text-white">
          <img src={coin} height="50px" width="50px" alt="Coins" />
          GCT Balance: {balance}
        </p>
        <button
          className="bg-red-500 text-white mt-4 p-2 rounded"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
