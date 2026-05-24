const fs = require('fs');
const cats = ['MATH','ESAS','EEPS'];
cats.forEach(c => {
  const dir = `data/REE/${c}`;
  let allQ = [];
  fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('qbank')).forEach(f => {
    const d = JSON.parse(fs.readFileSync(`${dir}/${f}`,'utf8'));
    if(d.questions) allQ = allQ.concat(d.questions);
  });
  const seen = new Set();
  const unique = allQ.filter(q => {
    if(seen.has(q.question)) return false;
    seen.add(q.question);
    return true;
  });
  const output = { category: c, total: unique.length, questions: unique };
  fs.writeFileSync(`${dir}/qbank_${c}.json`, JSON.stringify(output, null, 2));
  console.log(`✅ ${c}: ${unique.length} unique questions`);
});
