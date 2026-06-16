import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between">
        <Link to="/" className="font-bold text-xl">
          Support CRM
        </Link>

        <Link
          to="/create"
          className="bg-white text-blue-600 px-4 py-2 rounded"
        >
          Create Ticket
        </Link>
      </div>
    </div>
  );
}

export default Navbar;