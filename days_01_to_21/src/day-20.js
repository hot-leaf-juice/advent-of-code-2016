/*
--- Day 20: Firewall Rules ---

You'd like to set up a small hidden computer here so you can use it to get back into the network later. However, the corporate firewall only allows communication with certain external IP addresses.

You've retrieved the list of blocked IPs from the firewall, but the list seems to be messy and poorly maintained, and it's not clear which IPs are allowed. Also, rather than being written in dot-decimal notation, they are written as plain 32-bit integers, which can have any value from 0 through 4294967295, inclusive.

For example, suppose only the values 0 through 9 were valid, and that you retrieved the following blacklist:

5-8
0-2
4-7
The blacklist specifies ranges of IPs (inclusive of both the start and end value) that are not allowed. Then, the only IPs that this firewall allows are 3 and 9, since those are the only numbers not in any range.

Given the list of blocked IPs you retrieved from the firewall (your puzzle input), what is the lowest-valued IP that is not blocked?

Your puzzle answer was 32259706.

--- Part Two ---

How many IPs are allowed by the blacklist?

Your puzzle answer was 113.
*/

/*
We format our blacklist with the following sed & jq script

  sed -e 's/\(.*\)-\(.*\)/  [\1, \2],/; 1 i\ [' -e '$ s/,$//; $a \ ]' | jq sort

so that each pair `[lower, upper]` appears in order of `lowest` increasing.
Then we can calculate the list of allowed IPs in one simple reduction:
*/

function allowedIPs(blacklist) {
  return blacklist.reduce(({ top, allowed }, [lower, upper]) => {
    for (let i = top; i < lower; i++) { allowed.push(i); }
    return { top: Math.max(upper + 1, top), allowed }
  }, { top: 0, allowed: [] }).allowed;
}

export function part1(input) { return allowedIPs(input)[0]; }

export function part2(input) { return allowedIPs(input).length; }