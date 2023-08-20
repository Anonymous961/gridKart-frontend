import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (error) {
      console.log(error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="border-2 bg-slate-600 shadow-xl rounded-md p-8 w-1/3">
        <h1 className="mb-6 text-3xl text-center font-semibold text-gray-50">
          Login
        </h1>
        <form className="flex flex-col" onSubmit={handleLogin}>
          <input
            className="p-3 rounded-md mb-4 bg-gray-100 focus:outline-none focus:ring focus:border-green-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-3 rounded-md mb-4 bg-gray-100 focus:outline-none focus:ring focus:border-green-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-md mb-4"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <p className="text-center text-gray-50">
          New user?{" "}
          <Link
            to="/signup"
            className="text-gray-50 underline hover:text-emerald-600"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
