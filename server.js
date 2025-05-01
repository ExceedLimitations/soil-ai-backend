// server.js
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask-ai', async (req, res) => {
  const { zinc, npk, moisture, temp } = req.body;

  const prompt = `Soil Data:
  - Zinc Level: ${zinc}%
  - NPK Level: ${npk}%
  - Moisture Level: ${moisture}%
  - Temperature: ${temp}°C

Suggest appropriate farming actions for improving soil health based on the data above.`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ aiResponse: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error contacting OpenAI');
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});
