import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center px-10 p-5 bg-gray-400">
      <div onClick={() => navigate("/")}>
        <h1 className="text-4xl text-white">Navbar</h1>
      </div>
      <nav className="flex justify-evenly w-80">
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">login</Link>
      </nav>
    </div>
  );
};

export default Navbar;
