import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 bg-lime-400 rounded-md flex flex-col justify-center items-center p-8 px-20 w-1/3">
        <h1 className="mt-10 text-4xl text-white">Success!</h1>
        <p className="text-white">Coins Redeemed! Your reward is on the way.</p>
        <Link to="/redeem" className="mt-4 text-purple-500 underline">
          Continue Redeeming
        </Link>
      </div>
    </div>
  );
}
