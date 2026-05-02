require('dotenv').config();

const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

// --- Status helpers ---

/**
 * Returns a string to display as the bot's current status/activity.
 * Currently returns the current datetime stamp.
 */
function getStatus() {
    return new Date().toISOString();
}

/**
 * Updates the bot's presence/activity status with the result of getStatus().
 */
function updateStatus(client) {
    const status = getStatus();
    client.user.setPresence({
        activities: [{ name: status, type: ActivityType.Watching }],
        status: 'online',
    });
    console.log(`[Status] Updated to: ${status}`);
}

// --- Bot setup ---

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands from src/commands/
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.data.name, command);
}

// --- Event handlers ---

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Set status immediately on startup, then every 20 minutes
    updateStatus(client);
    setInterval(() => updateStatus(client), 20 * 60 * 1000);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', interaction.commandName, error);
        const reply = { content: 'There was an error executing that command.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(reply);
        } else {
            await interaction.reply(reply);
        }
    }
});

// --- Login ---

client.login(process.env.DISCORD_TOKEN);
