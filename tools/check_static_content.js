const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const checks = [
  { name: 'Bio / Who is Moïra', pattern: /Who is Moïra/i },
  { name: 'Bio paragraph', pattern: /Je suis une jeune mannequin gabonaise/i },
  { name: 'Directions artistiques', pattern: /Directions Artistiques/i },
  { name: 'Direction 1 text', pattern: /Silhouettes audacieuses/i },
  { name: 'Mensurations (Comp card)', pattern: /Mensurations officielles/i },
  { name: 'Mensurations details', pattern: /85\s*cm|Tour de taille|Poitrine/i },
  { name: 'Références / Timeline', pattern: /Shooting photo de campagne officielle|Daily Desiign|Kuba Concept Store|Miss Gabon Maroc 2026/i },
  { name: 'Contact & Booking', pattern: /Contact & Booking|Prête à donner vie à vos prochaines campagnes/i },
  { name: 'Form fields', pattern: /Envoyer la demande de booking|Dorcassmoira@gmail\.com/i }
];

console.log('=== Checking Static Content in index.html ===');
let allPassed = true;
checks.forEach(c => {
  const found = c.pattern.test(html);
  console.log(`${c.name} : ${found ? 'PRESENT IN HTML [OK]' : 'MISSING [FAIL]'}`);
  if (!found) allPassed = false;
});

console.log(`\nOverall Static Content Check: ${allPassed ? 'ALL PASSED [PERFECT]' : 'FAILURES DETECTED'}`);
