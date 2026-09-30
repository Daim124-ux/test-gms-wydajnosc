const fs = require('fs');
const content = fs.readFileSync('./public/mapa.svg', 'utf8');
const match = content.match(/<svg[^>]*>/i);
console.log(match ? match[0] : 'No SVG tag found');
