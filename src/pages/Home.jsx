import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc,collection,getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../services/firebase";

export default function Home() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.uid;
        const userRef = doc(db, "seller", userID);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserData(docSnapshot.data().walletAddress);
              fetchUserBalance(docSnapshot.data().walletAddress);
              fetchProducts();
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
  const fetchUserBalance = async (userAddress) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/fetchBalance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: userAddress }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance);
      } else {
        console.error("Error fetching balance:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
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

  if (userBalance === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-2/3">
        <h1 className="text-4xl font-bold mb-8">Products</h1>
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg p-4 shadow-md flex flex-col justify-between"
            >
              <img
                src="https://picsum.photos/200"
                alt={product.name}
                className="h-32 object-cover mb-2"
              />
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="mb-2">Price: ${product.price}</p>
              <p className="mb-2">Coins: {product.coins} coins</p>
              <button
                className={`${
                  product.coins > userBalance
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-500"
                } text-white py-2 rounded-md`}
                onClick={() => handleBuy(product)}
                disabled={product.coins > userBalance}
              >
                {product.coins > userBalance ? "Insufficient Funds" : "Buy"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
