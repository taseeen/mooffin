const { SlashCommandBuilder } = require("@discordjs/builders");

exports.command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    interaction.reply("Pong!");
    console.log(interaction.client.userData);
  },
};
