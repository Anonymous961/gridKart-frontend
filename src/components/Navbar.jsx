import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.displayName === "seller" ? setUser("seller") : setUser("user");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="flex justify-between items-center px-10 py-5 bg-blue-500">
      <div onClick={() => navigate("/")}>
        <h1 className="text-4xl text-white font-semibold cursor-pointer">
          GridKart
        </h1>
      </div>
      <nav className="flex justify-evenly items-center w-100 ">
        {!user && (
          <>
            <Link to="/signup" className="text-white hover:underline px-3">
              Sign Up
            </Link>
            <Link to="/login" className="text-white hover:underline px-3">
              Login
            </Link>
          </>
        )}
        {user && (
          <>
            <Link to="/history" className="text-white hover:underline px-3">
              Transaction History
            </Link>
            {user === "seller" ? (
              <>
                <Link to="/buy" className="text-white hover:underline px-3">
                  Buy Coins
                </Link>
                <Link
                  to="/addProducts"
                  className="text-white hover:underline px-3"
                >
                  Add Products
                </Link>
                <Link to="/profile" className="text-white hover:underline px-3">
                  <img
                    src="https://i.postimg.cc/Sx363vKC/userimage.webp"
                    className="w-20 rounded-md"
                    alt=""
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/redeem" className="text-white hover:underline px-3">
                  Redeem Coins
                </Link>
                <Link to="/profile" className="text-white hover:underline px-3">
                  <img
                    src="https://i.postimg.cc/Sx363vKC/userimage.webp"
                    className="w-20 rounded-md"
                    alt=""
                  />
                </Link>
              </>
            )}
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
