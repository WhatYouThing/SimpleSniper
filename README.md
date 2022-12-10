# SimpleSniper

**SimpleSniper is a Node.js script made for Discord, to serve as a useful utility tool for Discord users.**

The script is currently in very early development, so if you do use it, ill appreciate you sharing feedback or giving bug reports through github (or by joining the discord).

<img src=https://cdn.discordapp.com/attachments/768172991020007426/987829538845245460/sniper.png>

# Features
- Deleted message logging
- Purged messages logging (2+ deletions at once, like when someone gets banned)
- Server ban logging (be notified when you or other users get banned from your servers)
- Server self-leave logging (notifies when you leave servers, even if it was a kick, or a server deletion)
- Giveaway joiner (automatically join giveaways that are started in your servers, highly configurable)
- Support for tokens as launch arguments (npm start `TOKEN`)
- Multi-thread (running multiple tokens at the same time, has its own seperate file which is unmaintained)
- Control server (run commands for all your connected accounts through a Discord server, requires the accounts to be in the server and have access to the channel where you run commands)
- Webhook notifications

# Dependencies
- Uou will need to install the latest release of Node.js, which you can get from here: https://nodejs.org/en/

# Installation (Windows)
- To install the script and get it working, head over to the releases tab and download the most recent SimpleSniper.zip file.
- After you unpack the zip, go to the `.simplesniper` folder and edit the `config.json` file. There you will find `"token": "your_token_here"`, and to get the script working, you need to replace `your_token_here` with your Discord token. Uyou can google for methods how to obtain the token. Setting the token to `ask` will make the script always ask you for a token upon launch.
- After saving your token, you will have to run the `install_packages.bat` file to install the npm packages.
- After node tells you it installed x number of packages, you can close the console window and run `launch_simplesniper.bat` to start the script.

If you cannot run .bat files on your system, you will have to use commands to update and run the sniper. `npm i` updates, `npm run start` runs it. You may use `npm run start-notitle` if the other start command has issues.

# FAQ
## Why does the script need my token?
The account token is required for the script to log into Discord. If you think that your token would get sent off to a random webhook, read through the source code.

## Can i get banned?
You shouldn't be worried about getting banned, the default config should be safe to use.

## When update? / Did development end?
I would set the repo to archived if the development was finished, the lack of updates is because the project isn't and probably never will be my main priority.

## How do i configure the script?
Join the discord for support if you are unable to configure the selfbot yourself, the wiki will be getting a rework

## Nitro sniper?
I could add/skid one, but the chance that someone sends a nitro gift in a public text channel is very low. It's also possible that the nitro could be sniped by some inferior selfbot user who has better ping.

# Contact
- Join our [Discord server](https://discord.gg/yxCkjfATgE) (new link because the old one had a userbot raid sent through it) was if you happen to have any questions, bug reports or just want to join the community.
