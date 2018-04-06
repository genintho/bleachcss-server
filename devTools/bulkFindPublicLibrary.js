
const findPublicLibrary = require('../dist/lib/syncCssFiles/findPublicLibrary').default;

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('./famous_css_urls')
});

let match = 0;
let miss = 0;
rl.on('line', (line) => {
  const m = findPublicLibrary(()=>{}, line);
  if (m === null) {
    miss++
    console.log(line);
    return;
  }
  match++;
});

rl.on('close', (line) => {
    console.log('Match', match);
    console.log('Miss', miss);
});
