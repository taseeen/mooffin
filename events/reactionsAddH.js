const fs = require("fs");

module.exports = {
  name: "messageReactionAdd",
  async execute(messageReaction, user) {
    if (
      messageReaction.emoji.name === "❤️" &&
      user.id != messageReaction.message.author.id
    ) {
      authorID = messageReaction.message.author.id;
      client = user.client;
      if (client.userData.hasOwnProperty(authorID.toString())) {
        client.userData[authorID.toString()]["hearts"] += 1;
      } else {
        client.userData[authorID.toString()] = {
          hearts: 0,
          stars: 0,
          emoji: ":heart:",
        };
        client.userData[authorID.toString()]["hearts"] += 1;
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
