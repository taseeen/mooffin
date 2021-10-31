const { SlashCommandBuilder } = require("@discordjs/builders");
const { ownerId } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Shuts off the bot."),
  async execute(interaction) {
    if (interaction.member.id == ownerId) {
      await interaction.reply("Shutting down...");
      console.log("Shutting down...");
      await interaction.client.destroy();
    } else {
      interaction.reply({
        content: "You can't do that!",
        ephemeral: true,
      });
    }
  },
};
