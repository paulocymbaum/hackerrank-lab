/**
 * Leaderboard Scores
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

function updateLeaderboard(initialScores, events) {
  // TODO: return new scores object; use let/const correctly
  return {};
}

function main() {
  const result = updateLeaderboard(
    { alice: 10, bob: 4 },
    [
      { playerId: "alice", delta: 2 },
      { playerId: "carol", delta: 8 },
    ],
  );
  console.log(JSON.stringify(result));
}

if (require.main === module) {
  main();
}

module.exports = { updateLeaderboard };
