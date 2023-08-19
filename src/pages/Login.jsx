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
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 bg-lime-400 rounded-md flex flex-col justify-center items-center p-8 px-20 w-1/3">
        <h1 className="mt-10 text-4xl text-white">Login</h1>
        <form
          className="flex flex-col justify-center items-center pt-10 min-w-full"
          onSubmit={handleLogin}
        >
          <input
            className="p-2 rounded-md m-1 w-3/4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-2 rounded-md m-1 w-3/4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="submit"
            className="m-3 bg-green-400 p-3 rounded-md"
            value="Login"
          />
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <p>
          New user?{" "}
          <Link to="/signup" className="text-purple-500 underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
