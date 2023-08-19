import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center px-10 p-5 bg-gray-400">
      <div onClick={() => navigate("/")}>
        <h1 className="text-4xl text-white">GridKart</h1>
      </div>
      <nav className="flex justify-evenly items-center w-80">
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
        <Link to="/redeem">Redeem</Link>
        <Link to="/buy">Buy</Link>
        <Link to="/profile">
          <img
            src="https://i.postimg.cc/Sx363vKC/userimage.webp"
            className="w-20 rounded-md"
            alt=""
          />
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
