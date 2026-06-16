import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tickets";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.tickets || [];

      setTickets(data);
      setError("");
    } catch (err) {
      setError("Failed to connect to backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.customer_name ||
      !form.customer_email ||
      !form.subject ||
      !form.description
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(API_URL, {
        ticket_id: `TCK-${Date.now()}`,
        ...form,
      });

      setForm({
        customer_name: "",
        customer_email: "",
        subject: "",
        description: "",
      });

      fetchTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to create ticket");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      filterStatus === "All" || ticket.status === filterStatus;

    const matchesSearch =
      searchTerm === "" ||
      ticket.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Closed":
        return "bg-slate-200 text-slate-700";
      default:
        return "bg-indigo-100 text-indigo-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              CoreCRM
            </h1>
            <p className="text-sm text-slate-500">
              AI-Powered Support Dashboard
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
            ● System Online
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <div>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              File Support Case
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Register customer support issues directly into the queue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="customer_name"
                placeholder="Customer Name"
                value={form.customer_name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="email"
                name="customer_email"
                placeholder="Customer Email"
                value={form.customer_email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                name="subject"
                placeholder="Issue Subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                rows="4"
                name="description"
                placeholder="Describe the issue..."
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Create Ticket
              </button>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-2">
          {/* Search & Filter */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm mb-5">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  Active Queue Tracker
                </h2>

                <p className="text-sm text-slate-500">
                  Monitor and manage support tickets
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="🔍 Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-72 rounded-xl border border-slate-200 px-4 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-2 bg-slate-50"
                >
                  <option value="All">All</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              Loading tickets...
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 rounded-xl p-4 mb-4">
              {error}
            </div>
          )}

          {!loading && filteredTickets.length === 0 && (
            <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
              No tickets found
            </div>
          )}

          {/* Ticket List */}
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-indigo-200 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-mono text-indigo-600 mb-2">
                      {ticket.ticket_id || `TCK-${ticket.id}`}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {ticket.subject}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {ticket.customer_name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {ticket.customer_email}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="mt-4 text-slate-600">
                  {ticket.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}