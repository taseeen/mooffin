const { SlashCommandBuilder } = require("@discordjs/builders");
const { ownerId } = require("../json/config.json");
const { MessageEmbed } = require("discord.js");

exports.command = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Shuts off the bot"),
  async execute(interaction) {
    if (interaction.member.id == ownerId) {
      shutdown_embed = new MessageEmbed()
        .setDescription("Shutting down...")
        .setColor("GREY");
      await interaction.reply({
        embeds: [shutdown_embed],
      });
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
