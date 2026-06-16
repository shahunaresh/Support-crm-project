import axios from "axios";

const API =
  "http://localhost:5000/api/tickets";

export const getTickets = () =>
  axios.get(API);

export const createTicket = data =>
  axios.post(API, data);

export const getTicket = id =>
  axios.get(`${API}/${id}`);

export const updateTicket = (id, data) =>
  axios.put(`${API}/${id}`, data);