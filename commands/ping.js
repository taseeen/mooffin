const { SlashCommandBuilder } = require("@discordjs/builders");

exports.command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get bot latency"),
  async execute(interaction) {
    await interaction.reply(`Latency is \`${interaction.client.ws.ping}ms\``);
  },
};
