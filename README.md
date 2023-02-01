# SimpleSniper

**SimpleSniper is a Node.js script made for Discord, to serve as a useful utility tool for Discord users.**

The script is currently in very early development, so if you do use it, i'll appreciate you sharing feedback or giving bug reports through github (or by joining the discord).

<img src=https://cdn.discordapp.com/attachments/768172991020007426/987829538845245460/sniper.png>

# Features
- Deleted message logging
- Purged messages logging (2+ deletions at once, like when someone gets banned)
- Server ban logging (be notified when you or other users get banned from your servers)
- Server self-leave logging (notifies when you leave servers, even if it was a kick, or a server deletion)
- Giveaway Sniper (automatically join giveaways, highly configurable, for both reactions and buttons)
- Support for tokens as launch arguments (npm start `TOKEN`)
- Control Server (run selfbot commands through a Discord server)
- Webhook Notifications
- Login without token
- Friends Manager
- Tokenlog Protection (Experimental)

# Dependencies
- You will need to install the latest release of Node.js, which you can get from here: https://nodejs.org/en/

# Installation (Windows)
- To install the script and get it working, head over to the releases tab and download the most recent SimpleSniper.zip file.
- After you unpack the zip, go to the `.simplesniper` folder and edit the `config.json` file. There you will find `"token": "your_token_here"`, and to get the script working, you need to replace `your_token_here` with your Discord token. You can google for methods how to obtain the token. Setting the token to `ask` will make the script always ask you for a token upon launch.
- After saving your token, you will have to run the `install_packages.bat` file to install the npm packages.
- After node tells you it installed x number of packages, you can close the console window and run `launch_simplesniper.bat` to start the script.

If you cannot run .bat files on your system, you will have to use commands to update and run the sniper. `npm i` updates, `npm run start` runs it. You may use `npm run start-notitle` if the other start command has issues.

# FAQ

## Can i get banned?
You shouldn't be worried about getting banned, the default config should mostly be safe to use.

## When update? / Did development end?
I would set the repo to archived if the development was finished, the lack of updates is because the project isn't and probably never will be my main priority.

# Contact
- Join our [Discord server](https://discord.gg/yxCkjfATgE) (new link because the old one had a userbot raid sent through it) was if you happen to have any questions, bug reports or just want to join the community.

# Config Guide

Below is a example config file with descriptions, which should help you understand how everything works.

```
{
    "token_login": {
        "enabled": false, -- true/false, toggles if the token below should be used to automatically sign in.
        "token": "" -- string, the account token which will be used to sign in.
    },
    "normal_login": {
        "enabled": false, -- true/false, toggles if the details below should be used to automatically sign in.
        "email": "", -- string, your Discord account's email.
        "password": "", -- string, your Discord account's password.
        "has_two_factor": false -- true/false, set this to true if your account has 2FA enabled, it will make the script prompt you for the said code during launch.
    },
    "clear_cli_on_start": true, -- true/false, makes the script clear all the lines in the terminal that you start it in.
    "american_dates": false, -- true/false, changes the DD:MM:YYYY date format to MM:DD:YYYY 
    "activity": {
        "enabled": false, -- true/false, makes the selfbot apply the chosen status on your account after connecting
        "type": "invisible" -- string (dnd/idle/invisible/online), the activity type which you would like to have applied. invisible is the best option for running the selfbot on a alt. you don't have to set the activity when running the selfbot along a normal client on your pc/phone.
    },
    "tokenlog_protection": {
        "enabled": false, -- true/false, the main toggle for the tokenlog protection feature, which is designed to try to prevent your Discord account from getting hijacked. the protection uses a points system to check if a device is legit, you can configure the amount of points which each successful check adds, and how many are required for the device to pass.
        "discord_password": "", -- string, your Discord account's password, this is required for the selfbot to be able to block unwanted devices
        "location_whitelist": [], -- array of strings, this is the list of allowed cities/regions/countries that sessions can have. for example, adding "poland" would give points to the session if its connecting from poland, no matter the city or region. however, if you put "mazovia" or "mazovia, poland", only connections from that exact region would be granted points. you can have multiple strings to whitelist multiple locations. the easiest way to configure everything is to base the whitelists off of the device you use the most, by copying the values from the "current device". if you wish to use discord on multiple devices/cliens, just whitelist those.
        "location_points": 2, -- integer, the number of points that a session gains after the check succeeds. this value acts as a "priority" for each passed check. you can adjust how many points each check gives, and how many are required to pass. for example, the default config requires location, and atleast 1 other check to pass, due to location giving 2 points, and the required minimum being 3. its up to the user to decide what combination would be the most secure for them.
        "client_whitelist": [], -- array of strings, same as above but for the type of client (discord client, chrome, firefox etc.).
        "client_points": 1, -- integer, same as above but for the client type whitelist.
        "os_whitelist": [], -- array of strings, same as above but for the operating system (windows, android etc.).
        "os_points": 1, -- integer, same as above but for the operating system whitelist.
        "min_points_to_allow": 3, -- integer, the minimum amount of points that a session has to gain from all checks to be able to pass. if it reaches the amount, it gets whitelisted in the selfbot's memory. if not, it gets automatically signed out of your account (blocked).
        "max_blocks_per_interval": 1, -- integer, the max amount of devices that can be blocked per each check that runs. this value should be kept at 1 or 2, because its easy to get rate limited for attempting to log out multiple devices at once.
        "check_interval": 10000 -- time (in ms), the delay between each check the script does. should be kept at 5 seconds or more, because you could get rate limited. having a high value could leave you with a risk of something happening between 2 checks.
    },
    "crash_handler": {
        "log": true, -- true/false, controls if error messages should be saved in the log file.
        "notify": true, -- true/false, controls if error messages should appear in the console.
        "notify_r": 255,
        "notify_g": 75,
        "notify_b": 75, -- integer, RGB color values for notification colors. same for all modules.
        "force_disable": false, -- true/false, disables error handling when enabled. same for all modules.
        "webhook_url": "", -- string, Discord webhook url for notifications. same for all modules.
        "webhook_notify_enable": false -- true/false, controls if webhook notifications should be sent. same for all modules.
    },
    "friends_manager": {
        "enabled": true, -- true/false, enables/disables the friends manager (notifications for recieving friend requests, and losing friends).
        "log": true, -- true/false, toggles whether the notifications should be logged.
        "notify": true, -- true/false, toggles whether the notifications should appear in the console.
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "webhook_url": "",
        "webhook_notify_enable": false
    },
    "control_server": {
        "enabled": false, -- true/false, main toggle for the control server feature, which can be used to run selfbot commands in any discord server/channel.
        "cs_prefix": "", -- string, the prefix that your commands should have, for example "!".
        "cs_id": [], -- array of strings, list of server id's that would be considered as control servers.
        "enable_channel": false, -- true/false, controls if the channel whitelist should be enabled.
        "cs_channel": [], -- array of strings, list of channel id's that would be considered as valid.
        "enable_manager": false, -- true/false, controls if the user whitelist should be enabled.
        "cs_manager": [] -- array of strings, list of user id's that would be considered as valid.
    },
    "msg_create_event": {
        "enabled_server": false, -- true/false, triggers on any message in any server, not recommended.
        "enabled_dm": false, -- true/false, triggers when you recieve a DM from any user.
        "log": true,
        "notify": true,
        "ignore_bots": true, -- true/false, ignores messages from bots, same for all modules.
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "filter": [], -- array of strings, ignores the message event if the contents don't include a specified value.
        "enable_filter": false, -- true/false, controls if the content filter is enabled.
        "invert_filter": false, -- true/false, turns the whitelist into a blacklist, ignoring the message if it includes a value.
        "filter_case_sensitive": false, -- true/false, makes the filter case insensitive
        "user_whitelist": [], -- array of strings, same as the filter, but for user id's.
        "enable_user_list": false,
        "invert_user_list": false,
        "channel_whitelist": [], -- array of strings, same as the filter, but for channel id's.
        "enable_channel_list": false,
        "invert_channel_list": false,
        "guild_whitelist": [], -- array of strings, same as the filter, but for server id's.
        "enable_guild_list": false,
        "invert_guild_list": false,
        "webhook_url": "",
        "webhook_notify_enable": false
    },
    "msg_delete_event": {
        "enabled": true,
        "log": true,
        "notify": true,
        "ignore_bots": true,
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "filter": [],
        "enable_filter": false,
        "invert_filter": false,
        "filter_case_sensitive": false,
        "user_whitelist": [],
        "enable_user_list": false,
        "invert_user_list": false,
        "channel_whitelist": [],
        "enable_channel_list": false,
        "invert_channel_list": false,
        "guild_whitelist": [],
        "enable_guild_list": false,
        "invert_guild_list": false,
        "webhook_url": "",
        "webhook_notify_enable": false
    },
    "msg_purge_event": {
        "enabled": true,
        "log": true,
        "notify": true,
        "ignore_bots": true,
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "filter": [],
        "enable_filter": false,
        "invert_filter": false,
        "filter_case_sensitive": false,
        "user_whitelist": [],
        "enable_user_list": false,
        "invert_user_list": false,
        "channel_whitelist": [],
        "enable_channel_list": false,
        "invert_channel_list": false,
        "guild_whitelist": [],
        "enable_guild_list": false,
        "invert_guild_list": false,
        "webhook_url": "",
        "webhook_notify_enable": false
    },
    "msg_edit_event": {
        "enabled": true,
        "log": true,
        "notify": true,
        "ignore_bots": true,
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "filter": [],
        "enable_filter": false,
        "invert_filter": false,
        "filter_case_sensitive": false,
        "user_whitelist": [],
        "enable_user_list": false,
        "invert_user_list": false,
        "channel_whitelist": [],
        "enable_channel_list": false,
        "invert_channel_list": false,
        "guild_whitelist": [],
        "enable_guild_list": false,
        "invert_guild_list": false,
        "webhook_url": "",
        "webhook_notify_enable": false
    },
    "guild_ban_event": {
        "enabled_self": true, -- true/false, triggers when your account gets banned from any of your servers.
        "enabled_others": true, -- true/false, triggers when other people get banned from any of your servers.
        "log": true,
        "notify": true,
        "ignore_bots": true,
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "user_whitelist": [],
        "enable_user_list": false,
        "invert_user_list": false,
        "guild_whitelist": [],
        "enable_guild_list": false,
        "invert_guild_list": false,
        "webhook_url": "",
        "webhook_notify_enable": false
    },
    "guild_delete_event": {
        "enabled": true, -- true/false, triggers when you leave a server, either manually or because of a kick/deletion.
        "log": true,
        "notify": true,
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "guild_whitelist": [],
        "enable_guild_list": false,
        "invert_guild_list": false,
        "webhook_url": "",
        "webhook_notify_enable": false
    },
    "giveaway_sniper": {
        "enabled": true,
        "notify": true,
        "log": true,
        "content_filters": [], -- array of strings, the values that the giveaway message's content should have. case insensitive.
        "embed_filters": [
            "Hosted by:"
        ], -- array of strings, the values that the giveaway message's EMBED content should have. case insensitive.
        "bot_id_whitelist": [
            "294882584201003009"        
        ], -- array of strings, list of allowed bot user id's. contains GiveawayBot#2381 by default. 
        "channel_id_whitelist": [], -- array of strings, list of allowed channel id's.
        "delay_min": 30000, -- integer, the minimum amount of time (in ms) that the script waits before entering the giveaway.
        "delay_max": 300000, -- integer, the maximum amount of time (in ms) that the script waits before entering the giveaway.
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "webhook_url": "",
        "webhook_notify_enable": false
    },
    "legacy_giveaway_sniper": {
        "enabled": false,
        "notify": true,
        "log": true,
        "bot_check": true,
        "filter": [
            "GIVEAWAY"
        ],
        "enable_filter": true,
        "invert_filter": false,
        "filter_case_sensitive": false,
        "user_whitelist": [
            "294882584201003009"
        ],
        "enable_user_list": true,
        "invert_user_list": false,
        "channel_whitelist": [
            ""
        ],
        "enable_channel_list": false,
        "invert_channel_list": false,
        "emoji_whitelist": [
            "🎉"
        ], -- array of strings, list of allowed emoji's in the reaction.
        "enable_emoji_list": true,
        "invert_emoji_list": false,
        "delay_min": 30000,
        "delay_max": 300000,
        "notify_r": 244,
        "notify_g": 127,
        "notify_b": 255,
        "webhook_url": "",
        "webhook_notify_enable": false
    }
}
```
