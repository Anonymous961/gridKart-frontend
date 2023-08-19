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
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Product Description</label>
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          required
        />

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Gift Coins</label>
        <input
          type="number"
          value={coins}
          onChange={(e) => setCoins(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
