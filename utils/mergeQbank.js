const fs = require('fs');
const path = require('path');

const categories = ['MATH', 'ESAS', 'EEPS'];
const baseDir = path.join(__dirname, '../data/REE');

categories.forEach(category => {
  const folderPath = path.join(baseDir, category);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));

  let mergedQuestions = [];

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (Array.isArray(data.questions)) {
      mergedQuestions = mergedQuestions.concat(data.questions);
    }
  });

  // Add unique IDs
  mergedQuestions = mergedQuestions.map((q, index) => ({
    id: `${category}-${String(index + 1).padStart(4, '0')}`,
    ...q
  }));

  const output = {
    category,
    total: mergedQuestions.length,
    questions: mergedQuestions
  };

  fs.writeFileSync(
    path.join(folderPath, `qbank_${category}.json`),
    JSON.stringify(output, null, 2)
  );

  console.log(`✅ ${category}: ${mergedQuestions.length} questions merged → qbank_${category}.json`);
});
