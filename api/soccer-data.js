// api/soccer-data.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { league } = req.query;
  const apiKey = process.env.FOOTBALL_API_KEY; // Use environment variable for the API key

  if (!league) {
    res.status(400).json({ error: 'League parameter is required' });
    return;
  }

  try {
    const response = await fetch(`https://api.football-data.org/v2/competitions/${league}/matches`, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });
    
    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch data from Football-Data API' });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
