export default function handler(req, res) {
    const { league } = req.query;
    const apiKey = process.env.FOOTBALL_API_KEY;
  
    if (!league) {
      return res.status(400).json({ error: 'League parameter is required' });
    }
  
    fetch(`https://api.football-data.org/v4/competitions/${league}/matches`, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error('Error fetching data:', text);
            res.status(response.status).json({ error: 'Failed to fetch data from Football-Data API', details: text });
          });
        }
        return response.json().then(data => {
          res.status(200).json(data);
        });
      })
      .catch(error => {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
      });
  }
  