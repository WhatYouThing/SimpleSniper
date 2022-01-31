# SimpleSniper

**SimpleSniper is a Node.js script made for Discord, to serve as a useful utility tool for Discord users.**

The script is currently in very early development, so if you do use it, ill appreciate you sharing feedback or giving bug reports through github.

# Features
- Deleted message logging
- Purged messages logging (2+ deletions at once, like when someone is banned)
- Server ban logging (be notified when you or other users get banned from your servers)
- Server leave logging (notifies when you leave servers, even if its a kick or a server deletion)
- Note commands (run script commands by typing them into user notes on discord)
- Giveaway joiner (automatically join giveaways that are started in your servers, highly configurable)

# Note Commands
- this script makes use out of one of the most useless discord features, the user notes.
- by typing in commands into yours or others notes, you can easily use script features without the need to send and/or delete any messages, which also could be logged by other selfbot/modded discord users. 
<img src=https://cdn.discordapp.com/attachments/768172991020007426/937087752200159272/notecmd.png>

# Planned Features
- Friends Manager (notifications for friends adding/removing you)
- Control Server (ability to control the script, run commands and recieve webhook notifications in a private server)
- Server Monitor (notifications for being kicked/banned from servers, and for things that happen in the server)
- Nitro Sniper (detects and claims valid nitro gifts sent in servers, possibly getting you free nitro)
- and some other things i cant think of

# Dependencies
- you will need to install node.js, which you can get from here: https://nodejs.org/en/

# Installation
- to install the script and get it working, head over to the releases tab and download the most recent SimpleSniper.zip file.
- after you unpack the zip, go to the .simplesniper folder and edit the config.json file. there you will find `"token": "your_token_here"`, and to get the script working, you need to replace `your_token_here` with your discord token. you can google for methods how to obtain the token.
- once your token has been saved in the config file, now you will have to run the install_packages (type `npm update` in terminal if not on windows) file to set up the packages.
- when node tells you its finished installing packages, you can close the console window and run launch_simplesniper (`npm start` in terminal if not on windows) to start the script.

# FAQ
## Why does the script need my token?
the account token is required to be able to log in. if you think that your token would get sent off to a random webhook, read through the source code.

## Can i get banned?
the default config does not send any api requests other than the login one, which makes the script fairly safe to use. features with higher risks wont be added.

# Contact
- the project doesnt have its own discord server yet, but you may add me directly if you need anything. ``WhatYouThing#0001``

# Donations
you may dump your cryptocurrency into these wallets:

- BTC: ``bc1qqwdd5fkj2g95hhry7nc2kdltcxadvvek2ftrfz``
- ETH: ``0x9B92E475bB98ad3BC2004A531428d5EDe15fAeB7``
- ADA: ``addr1qyhv5adm4uq74xv59jxzsx07ywwse39uvdskzyshqns0he3wef6mhtcpa2vegtyv9qvluguapnztccmpvyfpwp8ql0nq66xgsr``
- LTC: ``LZZZGy4qba8NrhzGiGDB5kNatxK3V67Lnd``
- BCH: ``qpe8gxjv9ta5hddjv3y3qupxta64ra2wtqt09yp8lr``
- XMR: ``46eNvZZ6Lvg69rk865KRsbc7hBhmBaYrmNZXT2yNh6Akc33X9QQx8FT21GNV9FPUY2Hgt1iSBMaKTViKJ2xjm1Ny6FSTm8A``
- DOGE: ``DKFAWC8xGBd6DPK7vK9y5sJeVuHegNuPtJ``

- contact me on discord if you wish to donate through paypal
