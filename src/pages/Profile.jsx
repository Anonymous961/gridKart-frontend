export default function Profile() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col m-20 p-10 border-2 border-gray-200 rounded-xl bg-gray-200">
        <div>
          <img
            src="https://i.postimg.cc/Sx363vKC/userimage.webp"
            className="w-80 rounded-xl mb-10 float-right"
            alt=""
          />
          <p className="text-2xl m-2 ">Name:XYZ</p>
          <p className="text-2xl m-2 ">Email:XYZ</p>
          <p className="text-2xl m-2 ">Coins:XYZ</p>
          <p className="text-2xl m-2 ">WalletHash:XYZ</p>
        </div>
      </div>
    </div>
  );
}
