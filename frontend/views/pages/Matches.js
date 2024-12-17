const Matches = {
  render: async () => {
    return (await fetch("/views/templates/Matches.html")).text();
  },

  after_render: async () => {
    try {
      const storedData = sessionStorage.getItem("tournamentData");
      if (storedData) {
        const tournamentData = JSON.parse(storedData);
        updateMatchDisplay(tournamentData);
        sessionStorage.removeItem("tournamentData");
      } else {
        alert("No tournament data found in session storage.");
        window.location.hash = "#/tournament";
      }
    } catch (error) {
      console.error("Error handling tournament data:", error);
    }
  },
};

function updateMatchDisplay(tournament) {
  // Round 1 matches
  tournament.matches.forEach((match) => {
    if (match.player_matches.length === 2) {
      const player1 = match.player_matches[0].player.name;
      const player2 = match.player_matches[1].player.name;
      const score1 = match.player_matches[0].score;
      const score2 = match.player_matches[1].score;

      const matchNumber = match.match_number;
      if (matchNumber <= 4) {
        document.querySelector(`#match${matchNumber}-player1`).textContent =
          player1;
        document.querySelector(`#match${matchNumber}-player2`).textContent =
          player2;
        if (score1 > 0 || score2 > 0) {
          document.querySelector(`#match${matchNumber}-score1`).textContent =
            score1;
          document.querySelector(`#match${matchNumber}-score2`).textContent =
            score2;
        }
      }
    }
  });
}

export default Matches;
