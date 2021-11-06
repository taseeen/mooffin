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
const corners = [0, 2, 6, 8];
const oppositeCorner = { 0: 8, 2: 6, 6: 2, 8: 0 };
const sides = [1, 3, 5, 7];
const center = 4;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
        return this.user;
      } else if (
        this.grid[condition[0]] === o &&
        this.grid[condition[1]] === o &&
        this.grid[condition[2]] === o
      ) {
        return this.client;
      }
    }
    return false;
  }

  createEmbed() {
    return this.embed();
  }

  embed() {
    return new MessageEmbed()
      .setColor("ORANGE")
      .setTitle("Tic-Tac-Toe")
      .setDescription(
        `\`${this.user.username}\` v.s. \`${this.client.user.username}\`\n\`${this.turn.username}'s\` turn:`
      )
      .addField(
        "Grid",
        `${this.grid[0]}${this.grid[1]}${this.grid[2]}
        ${this.grid[3]}${this.grid[4]}${this.grid[5]}
        ${this.grid[6]}${this.grid[7]}${this.grid[8]}`
      );
  }

  move(index) {
    if (this.grid[index] === blank) {
      this.grid[index] = this.mark;
    }
  }

  compMove() {
    const gridCopy = [...this.grid];
    const possMoves = [];

    for (const [index, space] of gridCopy.entries()) {
      if (space === blank) {
        possMoves.push(index);
      }
    }

    for (const move of possMoves) {
      gridCopy[move] = o;
      if (this.winCheck().id === this.client.id) {
        return move;
      }
      gridCopy[move] = x;
      if (this.winCheck().id === this.client.id) {
        return move;
      }
      gridCopy[move] = blank;
    }
    if (gridCopy[center] === blank) {
      console.log("choosing center:");
      return center;
    }
    const playedCorners = [...corners].filter((space) => gridCopy[space] === x);
    const checkOpposite = [];
    playedCorners.forEach((corner) => {
      const opposite = oppositeCorner[corner];
      if (gridCopy[opposite] === blank) {
        checkOpposite.push(opposite);
      }
    });
    if (checkOpposite.length > 0) {
      return Math.min(...checkOpposite);
    }
    const freeCorners = [...corners].filter((corner) => {
      return gridCopy[corner] === blank;
    });
    if (freeCorners.length > 0) {
      return Math.min(...freeCorners);
    }
    const freeSides = [...sides].filter((side) => {
      return gridCopy[side] === blank;
    });
    if (freeSides.length > 0) {
      return Math.min(...freeSides);
    }
  }

  turnSwitch() {
    if (this.turn.id === this.user.id) {
      this.turn = this.client.user;
      this.mark = o;
    } else {
      this.turn = this.user;
      this.mark = x;
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Play Tic-Tac-Toe against a bot."),
  async execute(interaction) {
    const tictactoe = new TicTacToe(interaction.user, interaction.client);

    const message = await interaction.reply({
      embeds: [tictactoe.createEmbed()],
      fetchReply: true,
    });

    for (const move of moves) {
      await message.react(move);
    }

    const filter = (reaction, user) => {
      return (
        user.id === tictactoe.turn.id && moves.includes(reaction.emoji.name)
      );
    };

    // update
    while (!tictactoe.winCheck()) {
      if (tictactoe.turn.id === tictactoe.user.id) {
        const collector = new ReactionCollector(message, {
          filter,
          max: 1,
          time: 10_000,
        });

        collector.on("collect", (reaction, user) => {
          reaction.users.remove(user.id);

          index = moves.indexOf(reaction.emoji.name);
          tictactoe.move(index);

          tictactoe.turnSwitch();

          interaction.editReply({
            embeds: [tictactoe.embed()],
          });
        });

        // collector.on("end", (collected) => {
        //   console.log(collected.firstKey());
        // });
        await sleep(1000);
      } else if (tictactoe.turn.id === tictactoe.client.user.id) {
        const cM = tictactoe.compMove();
        console.log(cM);
        tictactoe.move(cM);
        tictactoe.turnSwitch();
        interaction.editReply({
          embeds: [tictactoe.embed()],
        });
        await sleep(1000);
      }
    }

    interaction.editReply("game over");
  },
};
