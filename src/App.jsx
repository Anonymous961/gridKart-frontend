import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddEdit";
import Redeem from "./pages/Redeem";
import Success from "./pages/SuccessRedeem";
import SuccessBuy from "./pages/SuccessBuy";
import SuccessRecived from "./pages/SuccessRecieved";
import BuyPage from "./pages/BuyPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.displayName === "seller" ? setUser("user") : setUser(null);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/redeem" element={<Redeem />} />
        <Route exact path="/buy" element={<BuyPage />} />
        <Route exact path="/redeem/success" element={<Success />} />
        <Route exact path="/buy/success" element={<SuccessBuy />} />
        <Route exact path="/product/success" element={<SuccessRecived />} />
        {user && <Route path="/addProducts" element={<AddProduct />} />}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
