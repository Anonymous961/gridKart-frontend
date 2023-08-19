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
    <div className="flex justify-between items-center px-10 p-5 bg-gray-400">
      <div onClick={() => navigate("/")}>
        <h1 className="text-4xl text-white">GridKart</h1>
      </div>
      <nav className="flex justify-evenly items-center w-80">
        {!user && (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {user && (
          <>
            {user === "seller" ? (
              <>
                <Link to="/buy">Buy Coins</Link>
                <Link to="/addProducts">Add Products</Link>
                <Link to="/profile">
                  <img
                    src="https://i.postimg.cc/Sx363vKC/userimage.webp"
                    className="w-20 rounded-md"
                    alt=""
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/redeem">Redeem Coins</Link>
                <Link to="/profile">
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
