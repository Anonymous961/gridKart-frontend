import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import History from "./pages/History";
import AddProduct from "./pages/AddEdit";
import Redeem from "./pages/Redeem";
import Success from "./pages/SuccessRedeem";
import SuccessBuy from "./pages/SuccessBuy";
import SuccessRecived from "./pages/SuccessRecieved";
import BuyPage from "./pages/BuyPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/history" element={<History />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/history" element={<History />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
