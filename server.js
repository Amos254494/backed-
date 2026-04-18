const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ✅ NEW PAY ROUTE (PUT YOUR CODE HERE)
app.post("/pay", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).send("Phone number is required");
  }

  try {
    const auth = Buffer.from(
      process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET
    ).toString("base64");

    const tokenRes = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` }
      }
    );

    const accessToken = tokenRes.data.access_token;

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:\.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      process.env.SHORTCODE +
      process.env.PASSKEY +
      timestamp
    ).toString("base64");

    const stkRes = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 200,
        PartyA: phone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: "https://backed--1.onrender.com/callback",
        AccountReference: "Earn App",
        TransactionDesc: "Payment"
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    console.log("STK Response:", stkRes.data);

    res.json({
      message: "STK Push sent. Check your phone 📱",
      data: stkRes.data
    });

  } catch (error) {
    console.error("M-Pesa Error:", error.response?.data || error.message);
    res.status(500).send("Payment failed");
  }
});


// CALLBACK
app.post("/callback", (req, res) => {
  console.log("M-Pesa Callback:", req.body);
  res.sendStatus(200);
});


// SERVER PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
