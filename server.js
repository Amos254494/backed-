const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// 🔹 Payment route (you will connect M-Pesa here later)
app.post("/pay", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).send("Phone number is required");
  }

  console.log("Payment request for:", phone);

  // TODO: Add M-Pesa STK Push here
  res.send("Payment request received. Check your phone 📱");
});


// 🔹 M-Pesa callback route
app.post("/callback", (req, res) => {
  console.log("M-Pesa Callback:", JSON.stringify(req.body, null, 2));

  // VERY IMPORTANT: always respond with 200
  res.sendStatus(200);
});


// 🔹 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});