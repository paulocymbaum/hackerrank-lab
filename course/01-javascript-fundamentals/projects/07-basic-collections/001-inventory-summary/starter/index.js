const inventory = [
  { name: "pen", qty: 10 },
  { name: "ink", qty: 2 },
  { name: "paper", qty: 50 },
  { name: "stapler", qty: 3 },
];

function totalUnits(items) {
  // TODO: sum qty
  return 0;
}

function getQty(item) {
  return item.qty;
}

function lowStockNames(items) {
  // TODO: filter qty < 5, map to name (use named helpers where useful)
  return [];
}

function main() {
  console.log("total:", totalUnits(inventory));
  console.log("low:", lowStockNames(inventory));
}

main();
