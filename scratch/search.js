const fs = require('fs');
const content = fs.readFileSync('app/booking/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('pricingCategories')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
