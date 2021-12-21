const fs = require("fs");

module.exports = {
  name: "messageReactionRemove",
  async execute(messageReaction, user) {
    if (
      messageReaction.emoji.name === "⭐" &&
      user.id != messageReaction.message.author.id
    ) {
      client.userData[messageReaction.message.author.id.toString()][
        "stars"
      ] -= 1;
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
