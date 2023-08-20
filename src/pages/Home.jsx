import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../services/firebase";
import coin from "../assets/coin.png";

export default function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchProducts();
      if (user) {
        const userID = user.uid;
        const userRef = doc(db, user.displayName, userID);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserData(docSnapshot.data().walletAddress);
            } else {
              console.log("User not found.");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        console.log("Error: No user");
      }
    });
    return () => unsubscribe();
  }, []);
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleBuy = async (product) => {
    try {
      const buyResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/mintCoins`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: userData,
            amount: product.coins,
          }),
        }
      );

      if (buyResponse.ok) {
        navigate("/product/success");
      } else {
        console.error("Error buying product:", buyResponse.statusText);
      }
    } catch (error) {
      console.error("Error buying product:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-2/3">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-600 rounded-lg p-6 shadow-md flex flex-col justify-between"
            >
              <img
                src="https://picsum.photos/200"
                alt={product.name}
                className="h-32 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-50 mb-2">{product.name}</h2>
              <p className="text-gray-50 mb-2">Price: ₹{product.price}</p>
              <p className="text-gray-50 mb-2">
                Coins:
                <img
                  src={coin}
                  alt="Coins"
                  className="h-8 w-8 ml-2 inline-block"
                />
                {product.coins} coins
              </p>
              <button
                className={`${
                  !userData
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white py-2 rounded-md`}
                onClick={() => handleBuy(product)}
                disabled={!userData}
              >
                {userData ? "Buy" : "Login First"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
