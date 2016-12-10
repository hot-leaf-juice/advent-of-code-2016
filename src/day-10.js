/*
--- Day 10: Balance Bots ---

You come upon a factory in which many robots are zooming around handing small
microchips to each other.

Upon closer examination, you notice that each bot only proceeds when it has two
microchips, and once it does, it gives each one to a different bot or puts it in
a marked "output" bin. Sometimes, bots take microchips from "input" bins, too.

Inspecting one of the microchips, it seems like they each contain a single
number; the bots must use some logic to decide what to do with each chip. You
access the local control computer and download the bots' instructions (your
puzzle input).

Some of the instructions specify that a specific-valued microchip should be
given to a specific bot; the rest of the instructions indicate what a given bot
should do with its lower-value or higher-value chip.

For example, consider the following instructions:

value 5 goes to bot 2 bot 2 gives low to bot 1 and high to bot 0 value 3 goes to
bot 1 bot 1 gives low to output 1 and high to bot 0 bot 0 gives low to output 2
and high to output 0 value 2 goes to bot 2 Initially, bot 1 starts with a
value-3 chip, and bot 2 starts with a value-2 chip and a value-5 chip. Because
bot 2 has two microchips, it gives its lower one (2) to bot 1 and its higher one
(5) to bot 0. Then, bot 1 has two microchips; it puts the value-2 chip in output
1 and gives the value-3 chip to bot 0. Finally, bot 0 has two microchips; it
puts the 3 in output 2 and the 5 in output 0. In the end, output bin 0 contains
a value-5 microchip, output bin 1 contains a value-2 microchip, and output bin 2
contains a value-3 microchip. In this configuration, bot number 2 is responsible
for comparing value-5 microchips with value-2 microchips.

Based on your instructions, what is the number of the bot that is responsible
for comparing value-61 microchips with value-17 microchips?

Your puzzle answer was 56.

--- Part Two ---

What do you get if you multiply together the values of one chip in each of
outputs 0, 1, and 2?

Your puzzle answer was 7847.
*/

class Swarm {
  constructor(x, y) {
    this.bots = [];
    this.outputs = [];
    this.logs = [];
  }

  redistribute(id) {
    const bot = this.bots[id];
    if (bot.lowTo && bot.highTo && bot.chips.length > 1) {
      const [low, high] = bot.chips.sort((x, y) => x - y);
      this.logs.push(`Bot ${id} compares ${low} and ${high}.`);
      this.give(bot.lowTo, low);
      this.give(bot.highTo, high);
      bot.chips = [];
    }
  }

  giveToBot(id, chip) {
    if (!this.bots[id]) { this.bots[id] = { chips: [] }; }
    this.bots[id].chips.push(chip);
    this.redistribute(id);
  }

  give(recipient, chip) {
    const [type, id] = recipient.split(" ");
    if (type === "bot") {
      this.giveToBot(id, chip);
    } else if (type === "output") {
      this.outputs[id] = chip;
    }
  }

  process(instruction) {
    if (instruction.operation === "defineBotBehaviour") {
      if (!this.bots[instruction.id]) {
        this.bots[instruction.id] = { chips: [] }
      }
      this.bots[instruction.id].lowTo = instruction.lowTo;
      this.bots[instruction.id].highTo = instruction.highTo;
      this.redistribute(instruction.id);
    } else if (instruction.operation === "assignChip") {
      this.give(instruction.recipient, instruction.chip);
    }
  }
}

export function part1(input) {
  const swarm = new Swarm();
  input.forEach(x => swarm.process(x));
  return swarm.logs.filter(l => l.includes("17 and 61"))[0].split(" ")[1];
}

export function part2(input) {
  const swarm = new Swarm();
  input.forEach(x => swarm.process(x));
  return swarm.outputs.slice(0, 3).reduce((x, y) => x * y);
}
