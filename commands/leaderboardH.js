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
    .setName("heartsleaderboard")
    .setDescription("See the hearts leaderboard"),
  async execute(interaction) {
    await interaction.deferReply();
    const userHearts = {};
    for (const [key, value] of Object.entries(interaction.client.userData)) {
      userHearts[key] = value["hearts"];
    }
    const sortedHeartsKeys = Object.keys(userHearts).sort(
      (x, y) => userHearts[y] - userHearts[x]
    );
    let heartsLeaderboard = "";
    const index_to_tag = {
      0: ":first_place:",
      1: ":second_place:",
      2: ":third_place:",
    };
    let posHeart;
    for (const [index, key] of sortedHeartsKeys.entries()) {
      let tag = index_to_tag[index]
        ? index_to_tag[index]
        : ":small_blue_diamond:";
      const user = await interaction.client.users
        .fetch(key)
        .catch(console.error);
      if (user.id === interaction.user.id) {
        tag = ":small_orange_diamond:";
        posHeart = index + 1;
      }
      heartsLeaderboard += `${tag} <@${user.id}> • ${userHearts[key]} ${interaction.client.userData[key]["heartEmoji"]}\n`;
    }
    const heartsEmbed = new MessageEmbed()
      .setTitle("Hearts Leaderboard")
      .setDescription(heartsLeaderboard)
      .setColor("DARK_RED");
    if (typeof posHeart !== "undefined") {
      heartsEmbed.setFooter(`You are ${ordinal(posHeart)} on the leaderboard!`);
    }
    await interaction.editReply({
      embeds: [heartsEmbed],
    });
  },
};
