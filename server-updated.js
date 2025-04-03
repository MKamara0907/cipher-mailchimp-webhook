const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ENV VARS from your .env file
const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.SERVER_PREFIX;
const defaultCampaignId = process.env.DEFAULT_CAMPAIGN_ID;
const templateId = process.env.TEMPLATE_ID;

// Log ping
app.get('/', (req, res) => {
  res.send('Cipher Mailchimp Webhook is live.');
});

// Main webhook endpoint
app.post('/api/webhook', async (req, res) => {
  const {
    campaign_id,
    theme,
    pillar_1,
    pillar_2,
    pillar_3,
    pillar_4,
    wealth_tip
  } = req.body;

  const finalCampaignId = campaign_id || defaultCampaignId;

  const htmlContent = `
    <h1>${theme}</h1>
    <h2>${pillar_1.header}</h2><p>${pillar_1.content}</p>
    <h2>${pillar_2.header}</h2><p>${pillar_2.content}</p>
    <h2>${pillar_3.header}</h2><p>${pillar_3.content}</p>
    <h2>${pillar_4.header}</h2><p>${pillar_4.content}</p>
    <h2>💡 Wealth Tip</h2><p>${wealth_tip}</p>
  `;

  try {
    // Set campaign content
    const response = await axios.put(
      `https://${serverPrefix}.api.mailchimp.com/3.0/campaigns/${finalCampaignId}/content`,
      { html: htmlContent },
      {
        auth: {
          username: 'anystring', // required but unused
          password: apiKey
        }
      }
    );

    res.status(200).json({ message: 'Campaign content updated', mailchimpResponse: response.data });
  } catch (error) {
    console.error('Error updating Mailchimp:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to update Mailchimp campaign' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
