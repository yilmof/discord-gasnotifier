# discord-gasnotifier
Deno program that queries the Ethereum gasprice every 10 seconds and sends a Discord webhook notification if the price is under specified threshold.
## Usage example
deno run --allow-read --allow-env --allow-net gasnotifier.ts 15

or compile to executable

deno compile --allow-read --allow-env --allow-net gasnotifier.ts 15

If gasprice is under 15, a discord webhook notification will be sent.