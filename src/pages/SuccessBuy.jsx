import { Link } from "react-router-dom";

const SuccessBuy = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="border-2 bg-slate-600 rounded-md flex flex-col justify-center items-center p-8 px-20 w-2/3">
        <h1 className="mt-10 text-4xl font-bold text-white">Success!</h1>
        <p className="text-white text-lg mt-3">
          Coins Bought! Reward Your Loyal Customers!
        </p>
        <Link
          to="/"
          className="mt-6 text-blue-300 hover:text-blue-400 underline"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessBuy;
