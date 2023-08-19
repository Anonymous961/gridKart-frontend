export default function Home() {
  const data = [{ name: "book", price: 500, id: 1 }];
  return (
    <div className="min-h-screen px-20 py-10">
      <div>
        {data.map((item) => (
          <div className="border-2 w-96 rounded-md pb-2" key={item.id}>
            <img
              src="https://i.postimg.cc/YCm2nGFb/book.jpg"
              className="rounded-md"
              alt=""
            />
            <h2 className="float-right text-xl mx-2 text-gray-500">
              ₹{item.price}
            </h2>
            <h1 className="text-xl mx-2">{item.name}</h1>
            <button className="float-right text-xl m-2 p-2 bg-yellow-400 rounded-md">
              Add to Cart
            </button>
            <button className="p-2 text-xl m-2 bg-green-400 w-28 rounded-md">
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
