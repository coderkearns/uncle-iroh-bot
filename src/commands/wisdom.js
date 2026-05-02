const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wisdom')
        .setDescription('Receive a piece of wisdom (placeholder)'),
    async execute(interaction) {
        await interaction.reply('Hello, World!');
    },
};
