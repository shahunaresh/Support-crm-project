import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TicketCard from "../components/TicketCard";
import SearchBar from "../components/SearchBar";
import StatusFilter from "../components/StatusFilter";
import { getTickets } from "../api/ticketApi";

function Home() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await getTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const searchMatch =
      search === "" ||
      ticket.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      status === "" || ticket.status === status;

    return searchMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-bold mb-2">
              File Support Case
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Register support tickets into the system.
            </p>

            <div className="text-sm text-gray-400">
              Support form goes here...
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2">

          {/* HEADER */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border mb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

              <div>
                <h2 className="text-lg font-bold">
                  Active Queue Tracker
                </h2>

                <p className="text-sm text-gray-500">
                  Monitor and manage support tickets
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                <SearchBar
                  search={search}
                  setSearch={setSearch}
                />

                <StatusFilter
                  status={status}
                  setStatus={setStatus}
                />

              </div>

            </div>
          </div>

          {/* TICKETS */}
          <div className="space-y-4">

            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.ticket_id || ticket.id}
                  ticket={ticket}
                />
              ))
            ) : (
              <div className="bg-white p-10 rounded-2xl border text-center">
                <h3 className="font-semibold text-gray-700">
                  No Tickets Found
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  No support tickets match your search criteria.
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;