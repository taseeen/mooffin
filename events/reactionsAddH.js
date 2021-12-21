const fs = require("fs");

module.exports = {
  name: "messageReactionAdd",
  async execute(messageReaction, user) {
    if (
      messageReaction.emoji.name === "❤️" &&
      user.id != messageReaction.message.author.id
    ) {
      const client = user.client;
      const author = messageReaction.message.author;
      if (client.userData.hasOwnProperty(author.id.toString())) {
        client.userData[author.id.toString()]["hearts"] += 1;
      } else {
        client.userData[author.id.toString()] = {
          hearts: 0,
          stars: 0,
          heartEmoji: ":heart:",
          starEmoji: ":star:",
        };
        client.userData[author.id.toString()]["hearts"] += 1;
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
