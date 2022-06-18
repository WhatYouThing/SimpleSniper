# SimpleSniper

**SimpleSniper is a Node.js script made for Discord, to serve as a useful utility tool for Discord users.**

The script is currently in very early development, so if you do use it, ill appreciate you sharing feedback or giving bug reports through github (or by joining the discord).

DISCORD SERVER: https://discord.gg/HACZXtr

<img src=https://cdn.discordapp.com/attachments/768172991020007426/987829538845245460/sniper.png>

# Features
- deleted message logging
- purged messages logging (2+ deletions at once, like when someone is banned)
- server ban logging (be notified when you or other users get banned from your servers)
- server leave logging (notifies when you leave servers, even if its a kick or a server deletion)
- note commands (run script commands by typing them into user notes on discord)
- giveaway joiner (automatically join giveaways that are started in your servers, highly configurable)
- support for tokens as launch arguments (npm start `TOKEN`)
- multi-thread (running multiple tokens at the same time, currently buggy)
- control server (run commands for all your connected accounts through a discord server, requires the accounts to be in the server and have access to the channel where you run said commands)

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
you shouldnt be worried about getting easily banned, the default config does not send any api requests other than the login one, which makes the script fairly safe to use.

## When update? / Did development end?
i would set the repo to archived if the development was finished, the lack of updates is because i also have to do other things, which stops me from working on the sniper. i likely will push fixes if bugs are found, but feature updates will usually take longer.

## How do i configure the script?
join the discord for support if you are unable to configure the selfbot yourself, the wiki will be getting a rework

## Nitro sniper?
i could add/skid one, but the event that someone does send a nitro in a public text channel is pretty rare. its also possible that the nitro could be sniped by some inferior selfbot user who has better ping than you.

# Contact
- join up on our [discord server](https://discord.gg/HACZXtr) if you have any questions, bug reports or just want to join the community.

# Donations
you may dump your cryptocurrency into these wallets:

- BTC: ``bc1qqwdd5fkj2g95hhry7nc2kdltcxadvvek2ftrfz``
- ETH: ``0x9B92E475bB98ad3BC2004A531428d5EDe15fAeB7``
- ADA: ``addr1qyhv5adm4uq74xv59jxzsx07ywwse39uvdskzyshqns0he3wef6mhtcpa2vegtyv9qvluguapnztccmpvyfpwp8ql0nq66xgsr``
- LTC: ``LZZZGy4qba8NrhzGiGDB5kNatxK3V67Lnd``
- BCH: ``qpe8gxjv9ta5hddjv3y3qupxta64ra2wtqt09yp8lr``
- XMR: ``46eNvZZ6Lvg69rk865KRsbc7hBhmBaYrmNZXT2yNh6Akc33X9QQx8FT21GNV9FPUY2Hgt1iSBMaKTViKJ2xjm1Ny6FSTm8A``
- DOGE: ``DKFAWC8xGBd6DPK7vK9y5sJeVuHegNuPtJ``

- contact me on discord if you wish to donate using paypal or a debit/credit card
