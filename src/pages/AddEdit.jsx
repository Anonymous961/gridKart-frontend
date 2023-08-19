import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coins, setCoins] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

      navigate("/products");
    } catch (error) {
      console.error("Error submitting product:", error);
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
