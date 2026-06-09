/**
 * User Badge Formatter
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

function formatUserBadge(user) {
  // TODO: normalize strings and return badge template literal
  return "";
}

function main() {
  try {
    const badge = formatUserBadge({
      displayName: "  Ana   Silva ",
      handle: "@AnaS",
      level: 3,
    });
    console.log(badge);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { formatUserBadge };
