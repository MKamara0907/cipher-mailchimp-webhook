const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/api/webhook', (req, res) => {
  const data = req.body;

  console.log("Received Mailchimp webhook payload:");
  console.log(JSON.stringify(data, null, 2));

  // Respond to Mailchimp
  res.status(200).json({ message: "Webhook received", received: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
