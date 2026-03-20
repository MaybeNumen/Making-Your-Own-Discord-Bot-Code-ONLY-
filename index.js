require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

// 1. Initialize the bot with the permissions it needs to read messages
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, 
  ],
});

// 2. Log a message when the bot comes online
client.on('ready', () => {
  console.log(`✅ Logged in securely as ${client.user.tag}!`);
});

// 3. Listen for messages to execute the !kick command
client.on('messageCreate', async (message) => {
  // Ignore messages from other bots or messages that don't start with !kick
  if (!message.content.startsWith('!kick') || message.author.bot) return;

  // Check if the person sending the command has permission to kick people
  if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
    return message.reply("🚫 You don't have permission to use this command.");
  }

  // Find the user mentioned in the command (e.g., !kick @User)
  const memberToKick = message.mentions.members.first();
  if (!memberToKick) {
    return message.reply("⚠️ Please mention a valid user to kick.");
  }

  // Attempt to kick the user
  try {
    await memberToKick.kick();
    message.reply(`🔨 Successfully kicked **${memberToKick.user.tag}**.`);
  } catch (error) {
    console.error(error);
    message.reply("❌ I couldn't kick that user. Please make sure my bot role is higher than theirs in the server settings.");
  }
});

// 4. Log the bot into Discord
client.login(process.env.TOKEN);