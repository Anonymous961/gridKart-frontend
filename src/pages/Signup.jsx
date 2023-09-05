import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("user");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async (e) => {
    e.preventDefault();
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      } else {
        console.error("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (!isWalletConnected) {
        console.error("Connect your MetaMask wallet first.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userRef = doc(db, type, user.uid);
      await setDoc(userRef, {
        name: name,
        email: email,
        type: type,
        walletAddress: walletAddress,
      });
      await updateProfile(user, {
        displayName: type,
      });
      console.log("Signed Up!");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  const handleCheckboxChange = (e) => {
    setType(e.target.checked ? "seller" : "user");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="border-2 bg-slate-600 shadow-md rounded-md p-8 w-1/3">
        <h1 className="mb-6 text-3xl text-center font-semibold text-gray-50">
          Sign Up
        </h1>
        <form className="flex flex-col" onSubmit={handleSignup}>
          <input
            type="text"
            className="p-3 rounded-md mb-4 bg-gray-100 focus:outline-none focus:ring focus:border-green-500"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="p-3 rounded-md mb-4 bg-gray-100 focus:outline-none focus:ring focus:border-green-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-3 rounded-md mb-4 bg-gray-100 focus:outline-none focus:ring focus:border-green-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="flex items-center m-1 text-gray-50">
            Are you a seller?
            <input
              type="checkbox"
              className="ml-2"
              checked={type === "seller"}
              onChange={handleCheckboxChange}
            />
          </label>
          <button
            onClick={connectWallet}
            className={`m-3 bg-blue-400 p-3 rounded-md text-gray-50 ${
              isWalletConnected && "cursor-not-allowed opacity-50"
            }`}
            disabled={isWalletConnected}
          >
            Connect MetaMask Wallet
          </button>
          <button
            onClick={handleSignup}
            className={`m-3 bg-green-500 hover:bg-green-600 text-gray-50 py-2 rounded-md ${
              !isWalletConnected && "cursor-not-allowed opacity-50"
            }`}
            disabled={!isWalletConnected}
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-50">
          Already a user?{" "}
          <Link
            to="/login"
            className="text-gray-50 underline hover:text-emerald-600"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
