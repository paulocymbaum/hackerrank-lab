function peek(label, value) {
  console.log(`${label}=${value}`);
}

function runScopeDemo() {
  let x = 1; // outer
  {
    let x = 2; // inner — TODO: log inner x
  }
  // TODO: log outer x
}

function main() {
  runScopeDemo();
  peek("done", 0);
}

main();
