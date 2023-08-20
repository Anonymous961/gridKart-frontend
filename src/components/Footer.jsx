export default function Footer() {
  return (
    <div className="min-w-full bg-slate-500">
      <div className="flex min-w-full justify-evenly py-6 text-white">
        <div className="max-w-xs">
          <h1 className="text-3xl font-semibold mb-4">GridKart</h1>
          <p className="text-sm text-gray-300">
            Your go-to platform for all things shopping!
          </p>
        </div>
        <ul className="max-w-xs">
          <li className="mb-2">About Us</li>
          <li className="mb-2">Contact</li>
        </ul>
        <ul className="max-w-xs">
          <li className="mb-2">Terms of Service</li>
          <li className="mb-2">Privacy Policy</li>
          <li className="mb-2">FAQs</li>
        </ul>
      </div>
    </div>
  );
}
