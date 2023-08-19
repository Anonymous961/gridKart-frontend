import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
      console.log("Signed Up!");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  const handleCheckboxChange = (e) => {
    setType(e.target.checked ? "seller" : "user");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 bg-lime-400 rounded-md flex flex-col justify-center items-center p-8 px-20 w-1/3">
        <h1 className="mt-10 text-4xl text-white">Sign up</h1>
        <form className="flex flex-col justify-center items-center pt-10 min-w-full">
          <input
            type="text"
            className="p-2 rounded-md m-1 w-3/4"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="p-2 rounded-md m-1 w-3/4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-2 rounded-md m-1 w-3/4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="flex items-center m-1">
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
            className="m-3 bg-blue-400 p-3 rounded-md"
          >
            Connect MetaMask Wallet
          </button>
          <button
            onClick={handleSignup}
            className={`m-3 bg-green-400 p-3 rounded-md ${
              !isWalletConnected && "cursor-not-allowed opacity-50"
            }`}
            disabled={!isWalletConnected}
          >
            Sign Up
          </button>
        </form>
        <p>
          Already a user?
          <Link to="/login" className="text-purple-500 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
