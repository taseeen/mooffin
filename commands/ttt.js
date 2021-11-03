const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, ReactionCollector } = require("discord.js");

const x = ":regional_indicator_x:";
const o = ":o2:";
const blank = ":white_large_square:";
const moves = ["↖️", "⬆️", "↗️", "⬅️", "⏺️", "➡️", "↙️", "⬇️", "↘️"];
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// create a class to handle all the game mechanics and stuff
class TicTacToe {
  constructor(user, client) {
    this.user = user;
    this.client = client;
    this.turn = user;
    this.mark = x;
    this.grid = [blank, blank, blank, blank, blank, blank, blank, blank, blank]; // lol
  }

  winCheck() {
    for (const condition of winningConditions) {
      if (
        this.grid[condition[0]] === x &&
        this.grid[condition[1]] === x &&
        this.grid[condition[2]] === x
      ) {
        return "x";
      } else if (
        this.grid[condition[0]] === o &&
        this.grid[condition[1]] === o &&
        this.grid[condition[2]] === o
      ) {
        return "o";
      } else {
        return false;
      }
    }
  }

  create_embed() {
    return this.embed(this.grid);
  }

  embed(grid) {
    return new MessageEmbed()
      .setColor("ORANGE")
      .setTitle("Tic-Tac-Toe")
      .setDescription(
        `\`${this.user.username}\` v.s. \`${this.client.user.username}\``
      )
      .addField(
        "Grid",
        `${grid[0]}${grid[1]}${grid[2]}
        ${grid[3]}${grid[4]}${grid[5]}
        ${grid[6]}${grid[7]}${grid[8]}`
      );
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play Tic-Tac-Toe against a bot."),
  async execute(interaction) {
    const tictactoe = new TicTacToe(interaction.user, interaction.client);

    const message = await interaction.reply({
      embeds: [tictactoe.create_embed()],
      fetchReply: true,
    });

    // for (const move of moves) {
    //   await message.react(move);
    // }

    console.log(tictactoe.turn.id);

    const filter = (reaction, user) => {
      return user.id === tictactoe.turn.id;
    };

    const collector = new ReactionCollector(message, {
      filter,
      max: 1,
      time: 5_000,
    });

    collector.on("collect", (reaction, user) => {
      console.log(reaction.emoji.name, user.tag);
    });

    collector.on("end", (collected) => {
      console.log(collected.firstKey());
    });
  },
};
