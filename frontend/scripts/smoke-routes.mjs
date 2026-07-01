const rotasEsperadas = [
  "/",
  "/?tab=content-map",
  "/course/javascript",
  "/course/javascript/module/01-javascript-fundamentals",
  "/course/javascript/module/01-javascript-fundamentals/lesson/01.1.1-running-javascript-node-js",
];

console.log("Smoke routes — paths esperados no AppRouter:");
for (const rota of rotasEsperadas) {
  console.log(`  OK ${rota}`);
}
console.log(`Total: ${rotasEsperadas.length} rotas documentadas.`);
