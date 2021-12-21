const fs = require("fs");
const { quotesChannelId } = require("../json/config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageReactionAdd",
  async execute(messageReaction, user) {
    if (messageReaction.emoji.name === "⭐") {
      const client = user.client;
      const author = messageReaction.message.author;
      if (!client.starredMessages.includes(messageReaction.message.id)) {
        const member = await messageReaction.message.guild.members.fetch(user);
        const quoteEmbed = new MessageEmbed()
          .setColor(member.roles.highest.color)
          .setAuthor(
            `${author.username}#${author.discriminator}`,
            `${author.avatarURL()}`
          )
          .setDescription(
            `${messageReaction.message.content}\n\n[Jump!](${messageReaction.message.url})`
          )
          .setFooter(
            `⭐ by ${user.username}#${user.discriminator}`,
            `${user.avatarURL()}`
          );
        const channel = await client.channels.fetch(quotesChannelId);
        await channel.send({ embeds: [quoteEmbed] });
        client.starredMessages.push(messageReaction.message.id);
      }
      if (client.userData.hasOwnProperty(author.id.toString())) {
        client.userData[author.id.toString()]["stars"] += 1;
      } else {
        client.userData[author.id.toString()] = {
          hearts: 0,
          stars: 0,
          heartEmoji: ":heart:",
          starEmoji: ":star:",
        };
        client.userData[author.id.toString()]["stars"] += 1;
      }
      fs.writeFile(
        "json/userData.json",
        JSON.stringify(client.userData),
        (err, file) => {
          if (err) throw err;
        }
      );
    }
  },
};
