const { SlashCommandBuilder } = require('discord.js');
const { episodes, quotes } = require('../../data/data.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wisdom')
        .setDescription('Receive a piece of wisdom'),
    async execute(interaction) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const episode = episodes.find(ep => ep.id === randomQuote.episode);

        const tags = randomQuote.tags
        const episodeName = episode.name
        const episodeShow = episode.show
        const episodeBook = episode.book
        const episodeEpisode = episode.episode

        let response = `**"${randomQuote.quote}"**\n\n— ${episodeName} (${episodeShow}, Book ${episodeBook}, Episode ${episodeEpisode})`;

        if (tags && tags.length > 0) {
            response += `\n\nTags: ${tags.join(', ')}`;
        }

        await interaction.reply(response);
    },
};
