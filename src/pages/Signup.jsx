import { Link } from "react-router-dom";
export default function Signup() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 bg-lime-400 rounded-md flex flex-col justify-center items-center p-8 px-20 w-1/3">
        <h1 className="mt-10 text-4xl text-white">Sign up</h1>
        <form className="flex flex-col justify-center items-center pt-10 min-w-full">
          <input
            type="text"
            className="p-2 rounded-md m-1 w-3/4"
            placeholder="Name"
          />
          <input
            type=""
            className="p-2 rounded-md m-1 w-3/4"
            name=""
            placeholder="Mobile number"
            id=""
          />
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
          already an user?
          <Link to="/login" className="text-purple-500 underline">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}
