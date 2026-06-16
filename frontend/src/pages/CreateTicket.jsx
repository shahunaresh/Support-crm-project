import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import { createTicket } from "../api/ticketApi";

function CreateTicket() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    await createTicket(form);

    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">

        <form
          onSubmit={submit}
          className="bg-white p-6 rounded shadow"
        >
          <h2 className="text-2xl font-bold mb-4">
            Create Ticket
          </h2>

          <input
            className="border p-2 w-full mb-4"
            placeholder="Customer Name"
            onChange={(e) =>
              setForm({
                ...form,
                customer_name: e.target.value
              })
            }
          />

          <input
            className="border p-2 w-full mb-4"
            placeholder="Customer Email"
            onChange={(e) =>
              setForm({
                ...form,
                customer_email: e.target.value
              })
            }
          />

          <input
            className="border p-2 w-full mb-4"
            placeholder="Subject"
            onChange={(e) =>
              setForm({
                ...form,
                subject: e.target.value
              })
            }
          />

          <textarea
            className="border p-2 w-full mb-4"
            rows="5"
            placeholder="Description"
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
          />

          <button
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateTicket;