const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/', (req, res) => {
  res.send('Fetch Num');
});

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'URL Invalid' });
  }

  const fetchNumbers = async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });
      return response.data.numbers;
    } catch (error) {
      console.error('Error number:', error);
      return null;
    }
  };

  try {
    const results = await Promise.all(
      urls.map(async (url) => {
        return await fetchNumbers(url);
      })
    );

    const validResults = results.filter((result) => result !== null);
    const mergedNumbers = Array.from(new Set(validResults.flat())).sort((a, b) => a - b);
    res.json({ numbers: mergedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
