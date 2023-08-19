import { Link } from "react-router-dom";
export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 bg-lime-400 rounded-md flex flex-col justify-center items-center p-8 px-20 w-1/3">
        <h1 className="mt-10 text-4xl text-white">Login</h1>
        <form className="flex flex-col justify-center items-center pt-10 min-w-full">
          <input
            className="p-2 rounded-md m-1 w-3/4"
            type="email"
            placeholder="Email"
          />
          <input
            className="p-2 rounded-md m-1 w-3/4"
            type="password"
            placeholder="Password"
          />
          <input type="submit" className="m-3 bg-green-400 p-3 rounded-md" />
        </form>
        <p>
          new user?
          <Link to="/signup" className="text-purple-500 underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
