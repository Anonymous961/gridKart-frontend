import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coins, setCoins] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.uid;
        const userRef = doc(db, "seller", userID);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redeemResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/redeemCoins`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: userData,
            amount: coins,
          }),
        }
      );

      if (!redeemResponse.ok) {
        throw new Error("Error redeeming gift coins");
      }

      const productData = {
        name,
        productDescription,
        price,
        coins,
      };

      const newProductRef = await addDoc(
        collection(db, "products"),
        productData
      );
      console.log("New product added with ID:", newProductRef.id);

      navigate("/");
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="border-2 bg-slate-600 shadow-md items-center rounded-md p-8 w-1/3">
        <h2 className="text-3xl text-center font-semibold mb-6 text-gray-50">
          Add Product
        </h2>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-50">
              Name
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-50">
              Product Description
            </label>
            <textarea
              className="w-full p-3 border rounded bg-white"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-50">
              Price
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded bg-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-50">
              Gift Coins
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded bg-white"
              value={coins}
              onChange={(e) => setCoins(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } text-white py-3 px-4 rounded disabled:opacity-50 items-center`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
