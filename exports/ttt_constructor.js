const { MessageEmbed } = require("discord.js");

const x = ":regional_indicator_x:";
const o = ":o2:";
const blank = ":white_large_square:";
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

class TicTacToe {
  constructor(user, client) {
    this.user = user;
    this.client = client;
    this.turn = user;
    this.mark = x;
    this.grid = [blank, blank, blank, blank, blank, blank, blank, blank, blank];
  }

  tieCheck() {
    for (const space of this.board) {
      if (space === blank) {
        return false;
      }
    }
    return true;
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

module.exports = TicTacToe;
