import { Link } from "react-router-dom";

function TicketCard({ ticket }) {
  return (
    <Link to={`/ticket/${ticket.ticket_id}`}>
      <div className="bg-white p-4 rounded shadow hover:shadow-lg">
        <h2 className="font-bold">{ticket.subject}</h2>

        <p>{ticket.customer_name}</p>

        <p className="text-sm text-gray-500">
          {ticket.ticket_id}
        </p>

        <span className="text-blue-600 font-semibold">
          {ticket.status}
        </span>
      </div>
    </Link>
  );
}

export default TicketCard;