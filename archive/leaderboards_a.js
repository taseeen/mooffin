const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

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
    .setName("leaderboards")
    .setDescription("See the leaderboards"),
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
    let posStar;
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
    const userStars = {};
    for (const [key, value] of Object.entries(interaction.client.userData)) {
      userStars[key] = value["stars"];
    }
    const sortedStarsKeys = Object.keys(userStars).sort(
      (x, y) => userStars[y] - userStars[x]
    );
    let starsLeaderboard = "";
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
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("switchLB")
        .setStyle("PRIMARY")
        .setEmoji("🔁")
    );
    await interaction
      .editReply({
        embeds: [heartsEmbed],
        components: [row],
        fetchReply: true,
      })
      .then((message) => {
        const collector = message.createMessageComponentCollector({
          componentType: "BUTTON",
          time: 5000,
          max: 1,
        });
        collector.on("collect", (button) => {
          if (button.user.id === interaction.user.id) {
            button.update({ embeds: [starsEmbed] });
          } else {
            i.reply({
              content: `These buttons aren't for you!`,
              ephemeral: true,
            });
          }
        });
        collector.on("end", (collected) => {
          console.log(`Collected ${collected.size} interactions.`);
        });
      });
  },
};
