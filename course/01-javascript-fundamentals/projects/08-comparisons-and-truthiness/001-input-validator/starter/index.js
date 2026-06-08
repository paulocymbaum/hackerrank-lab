function isValidUsername(value) {
  // TODO: null/undefined, trim, length
  return false;
}

function main() {
  const cases = ["ada", "", "   ", null, undefined];
  for (const c of cases) {
    console.log(c, "→", isValidUsername(c));
  }
}

main();
