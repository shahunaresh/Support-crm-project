import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getTicket,
  updateTicket
} from "../api/ticketApi";

function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);

  const [status, setStatus] =
    useState("Open");

  const [notes, setNotes] =
    useState("");

  const loadTicket = async () => {
    const response = await getTicket(id);

    setTicket(response.data);

    setStatus(response.data.status);

    setNotes(response.data.notes || "");
  };

  useEffect(() => {
    loadTicket();
  }, []);

  const save = async () => {
    await updateTicket(id, {
      status,
      notes
    });

    alert("Ticket Updated");
  };

  if (!ticket) return <h1>Loading...</h1>;

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">

        <div className="bg-white p-6 rounded shadow">

          <h1 className="text-2xl font-bold mb-4">
            {ticket.subject}
          </h1>

          <p>
            <strong>Customer:</strong>{" "}
            {ticket.customer_name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {ticket.customer_email}
          </p>

          <p className="mt-4">
            {ticket.description}
          </p>

          <div className="mt-6">

            <select
              className="border p-2"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>

          </div>

          <textarea
            className="border p-2 w-full mt-4"
            rows="5"
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />

          <button
            onClick={save}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Update Ticket
          </button>

        </div>
      </div>
    </>
  );
}

export default TicketDetails;