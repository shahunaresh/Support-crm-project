const express = require("express");
const router = express.Router();
const db = require("../database");

function generateTicketId() {
  return "TKT-" + Date.now();
}

router.post("/", (req, res) => {
  const {
    customer_name,
    customer_email,
    subject,
    description
  } = req.body;

  const ticketId = generateTicketId();

  db.run(
    `
      INSERT INTO tickets(
        ticket_id,
        customer_name,
        customer_email,
        subject,
        description
      )
      VALUES(?,?,?,?,?)
    `,
    [
      ticketId,
      customer_name,
      customer_email,
      subject,
      description
    ],
    function (err) {
      if (err)
        return res.status(500).json(err);

      res.status(201).json({
        ticket_id: ticketId
      });
    }
  );
});

router.get("/", (req, res) => {
  const { status, search } = req.query;

  let query = "SELECT * FROM tickets WHERE 1=1";
  const params = [];

  if (status) {
    query += " AND status=?";
    params.push(status);
  }

  if (search) {
    query += `
    AND (
      customer_name LIKE ?
      OR customer_email LIKE ?
      OR ticket_id LIKE ?
      OR description LIKE ?
    )`;

    params.push(
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    );
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err)
      return res.status(500).json(err);

    res.json(rows);
  });
});

router.get("/:ticketId", (req, res) => {
  db.get(
    `
      SELECT *
      FROM tickets
      WHERE ticket_id=?
    `,
    [req.params.ticketId],
    (err, row) => {
      if (err)
        return res.status(500).json(err);

      res.json(row);
    }
  );
});

router.put("/:ticketId", (req, res) => {
  const { status, notes } = req.body;

  db.run(
    `
    UPDATE tickets
    SET
      status=?,
      notes=?,
      updated_at=CURRENT_TIMESTAMP
    WHERE ticket_id=?
  `,
    [status, notes, req.params.ticketId],
    function (err) {
      if (err)
        return res.status(500).json(err);

      res.json({
        success: true
      });
    }
  );
});

module.exports = router;