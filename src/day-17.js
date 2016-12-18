/*
--- Day 17: Two Steps Forward ---

You're trying to access a secure vault protected by a 4x4 grid of small rooms
connected by doors. You start in the top-left room (marked S), and you can
access the vault (marked V) once you reach the bottom-right room:

#########
######### #S| | | # #-#-#-#-# # | | | # #-#-#-#-# # | | | # #-#-#-#-# # | | |   #######
#########
V Fixed walls are marked with #, and doors are marked with - or |.

The doors in your current room are either open or closed (and locked) based on
the hexadecimal MD5 hash of a passcode (your puzzle input) followed by a
sequence of uppercase characters representing the path you have taken so far (U
for up, D for down, L for left, and R for right).

Only the first four characters of the hash are used; they represent,
respectively, the doors up, down, left, and right from your current position.
Any b, c, d, e, or f means that the corresponding door is open; any other
character (any number or a) means that the corresponding door is closed and
locked.

To access the vault, all you need to do is reach the bottom-right room; reaching
this room opens the vault and all doors in the maze.

For example, suppose the passcode is hijkl. Initially, you have taken no steps,
and so your path is empty: you simply find the MD5 hash of hijkl alone. The
first four characters of this hash are ced9, which indicate that up is open (c),
down is open (e), left is open (d), and right is closed and locked (9). Because
you start in the top-left corner, there are no "up" or "left" doors to be open,
so your only choice is down.

Next, having gone only one step (down, or D), you find the hash of hijklD. This
produces f2bc, which indicates that you can go back up, left (but that's a
wall), or right. Going right means hashing hijklDR to get 5745 - all doors
closed and locked. However, going up instead is worthwhile: even though it
returns you to the room you started in, your path would then be DU, opening a
different set of doors.

After going DU (and then hashing hijklDU to get 528e), only the right door is
open; after going DUR, all doors lock. (Fortunately, your actual passcode is not
hijkl).

Passcodes actually used by Easter Bunny Vault Security do allow access to the
vault if you know the right path. For example:

If your passcode were ihgpwlah, the shortest path would be DDRRRD. With
kglvqrro, the shortest path would be DDUDRLRRUDRD. With ulqzkmiv, the shortest
would be DRURDRUDDLLDLUURRDULRLDUUDDDRR. Given your vault's passcode, what is
the shortest path (the actual path, not just the length) to reach the vault?

Your puzzle answer was RRRLDRDUDD.

--- Part Two ---

You're curious how robust this security solution really is, and so you decide to
find longer and longer paths which still provide access to the vault. You
remember that paths always end the first time they reach the bottom-right room
(that is, they can never pass through it, only end in it).

For example:

If your passcode were ihgpwlah, the longest path would take 370 steps. With
kglvqrro, the longest path would be 492 steps long. With ulqzkmiv, the longest
path would be 830 steps long. What is the length of the longest path that
reaches the vault?

Your puzzle answer was 706.
*/

import MD5 from '../node_modules/md5-es/src/MD5.js';

const directions = ["U", "D", "L", "R"];

/* Returns true if and only if we hit a door by moving in the given direction
  from the given [x, y] position. */
function isDoor([x, y], direction) {
  if (x === 0 && direction === "L") { return false; }
  if (x === 3 && direction === "R") { return false; }
  if (y === 0 && direction === "D") { return false; }
  if (y === 3 && direction === "U") { return false; }
  return true;
}

class Maze {
  constructor(pass) { this.pass = pass; }

  validNextMoves({ position, path }) {
    const hash = MD5.hash(this.pass + path);
    // We make use of the convenient fact that "i" < "a" for any digit i.
    return directions.filter((d, i) => hash[i] > "a" && isDoor(position, d));
  }
}

function move({ position: [x, y], path }, direction) {
  if (direction === "U") { y++; }
  if (direction === "D") { y--; }
  if (direction === "L") { x--; }
  if (direction === "R") { x++; }
  return { position: [x, y], path: path + direction };
}

function findPaths(maze, firstOnly = false) {
  let states = [{ position: [0, 3], path: [] }], final = [];
  while (states.length > 0 && (!firstOnly || final.length === 0)) {
    states = states
      .map(s => maze.validNextMoves(s).map(d => move(s, d)))
      .reduce((x, y) => [...x, ...y])
      .filter(({ position: [x, y], path }) => {
        if (x === 3 && y === 0) {
          // SIDE EFFECT: Record elements that we’re filtering out in final.
          final.push(path);
          return false;
        }
        return true;
      });
  }
  return final;
}

export function part1(input) { return findPaths(new Maze(input), true)[0]; }

export function part2(input) {
  const paths = findPaths(new Maze(input));
  return paths[paths.length - 1].length;
}
