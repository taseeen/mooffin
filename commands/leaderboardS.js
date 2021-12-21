const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

function ordinal(n) {
  n = parseFloat(n);
  let suffix = ["th", "st", "nd", "rd", "th"][Math.min(n % 10, 4)];
  if (11 <= n % 100 && 13 >= n % 100) {
    suffix = "th";
  }
  return n.toString() + suffix;
}

exports.command = {
  data: new SlashCommandBuilder()
    .setName("starsleaderboard")
    .setDescription("See the stars leaderboard"),
  async execute(interaction) {
    await interaction.deferReply();
    let posStar;
    const userStars = {};
    for (const [key, value] of Object.entries(interaction.client.userData)) {
      userStars[key] = value["stars"];
    }
    const sortedStarsKeys = Object.keys(userStars).sort(
      (x, y) => userStars[y] - userStars[x]
    );
    let starsLeaderboard = "";
    const index_to_tag = {
      0: ":first_place:",
      1: ":second_place:",
      2: ":third_place:",
    };
    for (const [index, key] of sortedStarsKeys.entries()) {
      let tag = index_to_tag[index]
        ? index_to_tag[index]
        : ":small_blue_diamond:";
      const user = await interaction.client.users
        .fetch(key)
        .catch(console.error);
      if (user.id === interaction.user.id) {
        tag = ":small_orange_diamond:";
        posStar = index + 1;
      }
      starsLeaderboard += `${tag} <@${user.id}> • ${userStars[key]} ${interaction.client.userData[key]["starEmoji"]}\n`;
    }
    const starsEmbed = new MessageEmbed()
      .setTitle("Stars Leaderboard")
      .setDescription(starsLeaderboard)
      .setColor("YELLOW");
    if (typeof posStar !== "undefined") {
      starsEmbed.setFooter(`You are ${ordinal(posStar)} on the leaderboard!`);
    }
    await interaction.editReply({
      embeds: [starsEmbed],
    });
  },
};
