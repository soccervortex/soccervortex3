// live-script.js

document.addEventListener('DOMContentLoaded', () => {
    const leagueSelect = document.getElementById('league-select');
    fetchLiveMatches(leagueSelect.value); // Fetch data for initially selected league

    leagueSelect.addEventListener('change', (event) => {
        fetchLiveMatches(event.target.value);
    });

    // Set up regular updates every 30 seconds
    setInterval(() => {
        fetchLiveMatches(leagueSelect.value);
    }, 30000);
});

async function fetchLiveMatches(league) {
    try {
        // Fetch live matches for the specified league from the API
        const response = await fetch(`/api/soccer-data?league=${league}`);

        // Check if the response is OK (status code 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data from the response
        const data = await response.json();

        // Check if there are any matches in the response
        if (data.matches && data.matches.length > 0) {
            console.log(data.matches); // Log the matches to the console for debugging
            displayLiveMatches(data.matches); // Call the function to display matches
        } else {
            console.log('No live matches found for this league.'); // Handle case with no matches
        }
    } catch (error) {
        console.error('Error fetching live matches:', error); // Log any errors that occur during fetch
    }
}

function displayLiveMatches(matches) {
    const container = document.getElementById('live-soccer-data');
    container.innerHTML = '';

    if (!matches || matches.length === 0) {
        container.innerHTML = '<p>No live matches found for the selected league.</p>';
        return;
    }

    // Filter live matches
    const liveMatches = matches.filter(match => match.status === 'IN_PLAY');

    if (liveMatches.length === 0) {
        container.innerHTML = '<p>No live matches found.</p>';
        return;
    }

    liveMatches.forEach(match => {
        const homeScore = match.score.fullTime.home !== null ? match.score.fullTime.home : '-';
        const awayScore = match.score.fullTime.away !== null ? match.score.fullTime.away : '-';

        const matchElement = document.createElement('div');
        matchElement.className = 'match live';
        matchElement.innerHTML = `
            <div class="match-info">
                <p>
                    <img src="${match.homeTeamLogo}" alt="${match.homeTeam.name} logo" class="team-logo">
                    ${match.homeTeam.name} ${homeScore} vs ${awayScore} ${match.awayTeam.name}
                    <img src="${match.awayTeamLogo}" alt="${match.awayTeam.name} logo" class="team-logo">
                </p>
                <p>Date: ${new Date(match.utcDate).toLocaleString()}</p>
            </div>
        `;
        container.appendChild(matchElement);
    });
}
