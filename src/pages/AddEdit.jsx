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
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Product Description
          </label>
          <textarea
            className="w-full p-2 border rounded"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Price</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Gift Coins</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
