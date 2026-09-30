const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'mapa.svg');
let svgContent = fs.readFileSync(svgPath, 'utf8');

// Optionally strip XML preamble if it exists
svgContent = svgContent.replace(/<\?xml[^>]*\?>\s*/g, '');

// Strip sodipodi/inkscape definitions that might cause warnings, but it's fine for dangerouslySetInnerHTML.
// Let's just escape backticks and dollar signs for template literal.
const escapedContent = svgContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');

const tsContent = `export const MAP_SVG = \`${escapedContent}\`;\n`;

const outPath = path.join(__dirname, 'src', 'components', 'HomeWhereToBuy', 'mapString.ts');
fs.writeFileSync(outPath, tsContent);
console.log('Successfully generated mapString.ts');
