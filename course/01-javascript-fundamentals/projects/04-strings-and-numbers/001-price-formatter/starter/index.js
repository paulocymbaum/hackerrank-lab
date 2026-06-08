function formatPrice(amount) {
  const n = Number(amount);
  // TODO: if NaN return "invalid"
  // TODO: else return template R$ with toFixed(2)
  return "invalid";
}

function main() {
  console.log(formatPrice(19.9));
  console.log(formatPrice("abc"));
}

main();
