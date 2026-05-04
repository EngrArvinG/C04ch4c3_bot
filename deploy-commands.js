require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Start the quiz')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN || process.env.TOKEN);

(async () => {
  try {
    console.log('Refreshing application commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID || process.env.DISCORD_APPLICATION_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Successfully deployed commands.');
  } catch (error) {
    console.error(error);
  }
})();
