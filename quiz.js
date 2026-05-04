const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, '..', 'data', 'quiz.json');

function loadQuizData() {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load questions file:', error);
    return {};
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Send a random quiz question'),

  async execute(interaction) {
    try {
      const quizData = loadQuizData();
      const subjectBlock = quizData.electric_circuits;

      if (!subjectBlock || !Array.isArray(subjectBlock.questions) || subjectBlock.questions.length === 0) {
        return interaction.reply({
          content: 'Walang laman ang quiz file.',
          ephemeral: true,
        });
      }

      const q = subjectBlock.questions[Math.floor(Math.random() * subjectBlock.questions.length)];

      if (!q || !q.question || !Array.isArray(q.options) || q.options.length < 4) {
        return interaction.reply({
          content: 'Invalid question format sa quiz file.',
          ephemeral: true,
        });
      }

      const labels = ['A', 'B', 'C', 'D'];
      const choices = q.options
        .slice(0, 4)
        .map((opt, i) => `${labels[i]}. ${opt}`)
        .join('
');

      return interaction.reply({
        content: `**${subjectBlock.subject || 'Quiz'}**

${q.question}

${choices}`,
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'May error sa quiz command.',
        ephemeral: true,
      });
    }
  },
};
