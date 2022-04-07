const Discord = require('legend.js');
const { writeFile, readFile } = require('fs');
const prompt = require('prompt-sync')()

async function log(content, r, g, b) {
  var color = await rgbx1b(r, g, b)
  var time = await getfulldate(false)
  console.log(`\x1B[38;2;87;90;96m[${time}]\x1b[0m ${color}${content}\x1b[0m`)
}
function getfulldate(shitdowscompatibility) { // returns the day, month, year, and the current time.
  return new Promise (resolve => {
    var date = new Date
    var output
    var day = date.getDate()
    if (day.toString().length < 2) {day = "0" + day}
    var month = date.getMonth() + 1
    if (month.toString().length < 2) {month = "0" + month}
    var minute = date.getMinutes() // simple but scuffed fixes for javascript returning single digits like 0:0 instead of 00:00
    if (minute.toString().length < 2) {minute = "0" + minute}
    var hour = date.getHours()
    if (hour.toString().length < 2) {hour = "0" + hour}
    var seconds = date.getSeconds()
    if (seconds.toString().length < 2) {seconds = "0" + seconds}
    var ms = date.getMilliseconds()
    if (ms.toString().length < 2) {ms = "0" + ms}
    if (ms.toString().length < 3) {ms = "0" + ms}
    if (shitdowscompatibility) {
      output = `${day}-${month}-${date.getFullYear()}_${hour}-${minute}-${seconds}.${ms}`
    }
    else {
      output = `${day}-${month}-${date.getFullYear()} ${hour}:${minute}:${seconds}.${ms}`
    }
    resolve(output)
  })
}
function writefile(path, content) {
  return new Promise (resolve => {
    writeFile(`${String(path)}`, String(content), (error) => {
      if (error) {catchexception(error)}
      resolve(undefined)
    })
  })
}
function readfile(path) {
  return new Promise (resolve => {
    readFile(`${String(path)}`, "utf8", function(err, data) {resolve(data)})
  })
}
async function catchexception(error) {
  if (config.crash_handler.notify) {
    log(`A exception has been caught. (${error})`, 255, 75, 75)
  }
  if (config.crash_handler.log) {
    var date = await getfulldate(true)
    writefile(`.simplesniper/logs/error_logs/error-${date}.txt`, error)
  }
}
var config
async function readconfig(notify) {
  if (notify) {log(`\x1b[33mReading config...`), 86, 98, 246}
  var output = await readfile(".simplesniper/config.json") // had to do this because javascript hates being asynchronous
  config = JSON.parse(String(output))
  if (notify) {log(`\x1b[92mConfig read!`), 86, 98, 246}
}
async function rng(min, max, decimal) {
  return new Promise(resolve =>{
    var number = Math.random() * (Number(max) - Number(min)) + Number(min)
    number = number.toFixed(Number(decimal))
    resolve(Number(number))
  })
}
async function doesinclude(checked, tocheck, casesensitive, splitter) {
  if (!splitter) {
    splitter = config.splitter
  }
  return new Promise(resolve =>{
    tocheck = String(tocheck).split(splitter)
    tocheck.forEach(string => {
      if (!casesensitive) {
        if (String(checked).toLowerCase().includes(string.toLowerCase())) {
          resolve(true)
        }
      }
      else {
        if (String(checked).includes(string)) {
          resolve(true)
        }
      }
    })
    resolve(false)
  })
}
async function rgbx1b(r, g, b) {
  if (!r && r != 0) {
    r = 255
  }
  if (!g && g != 0) {
    g = 255
  }
  if (!b && b != 0) {
    b = 255
  }
  return new Promise(resolve =>{
    resolve(`\x1B[38;2;${String(r)};${String(g)};${String(b)}m`)
  })
}
async function truncate(string, count) {
  return new Promise(resolve =>{
    if (!count) {
      count = config.truncate_max
    }
    if (String(string).length > Number(count)) {
      resolve(`${String(string).substring(0, Number(count))}...`)
    }
    else {
      resolve(String(string).substring(0, Number(count)))
    }
  })
}

// main functions
async function main() {
  await readconfig(false)
  if (config.clear_cli_on_start) {
    process.stdout.moveCursor(0, -process.stdout.rows)
    process.stdout.clearScreenDown()
  }
  log(`SimpleSniper-${config.version} initialized.`, 86, 98, 246)
  var token
  var launcharg = process.argv.slice(2)
  if (launcharg != '') {
    token = launcharg
    await log("Found a launch argument, applying it as the token and starting.", 86, 98, 246)
  }
  else if (String(config.token).toLowerCase() == 'ask') {
    await log("Your token is currently set to \"ask\", please input your token to start:", 86, 98, 246)
    token = prompt()
    process.stdout.moveCursor(0, -2)
    process.stdout.clearScreenDown() // thanks stackoverflow
    await log("Token applied, proceeding with the launch.", 86, 98, 246)
  }
  else if (String(config.token).toLowerCase() == 'multirun') {
    await log("Your token is currently set to \"multirun\", reading tokenlist.txt and logging in on all accounts...", 86, 98, 246)
    var tokenlist = await readfile(".simplesniper/multirun/tokenlist.txt")
    token = String(tokenlist).split('\n')
    var tokencount = 0
    for (var i of token) {
      tokencount = tokencount + 1
      auth(String(i).trim(), Number(tokencount))
    }
    return
  }
  else {
    token = config.token
  }
  auth(String(token))
}
async function auth(token, accnumber) {
  var prefix = ''
  const client = new Discord.Client()
  async function command(input, cmdtype) {
    return new Promise(async resolve => {
      if (input != undefined && cmdtype != undefined) {
        log(`${prefix}Running ${cmdtype} Command: ${input}`, 86, 98, 246)
      }
      if (input.toLowerCase().startsWith("load")) {
        await readconfig(true)
        return
      }
      if (input.toLowerCase().startsWith("exit")) {
        log(`${prefix}Logging out of SimpleSniper.`, 86, 98, 246)
        client.destroy()
      }
      if (input.toLowerCase().startsWith("clear")) {
        process.stdout.moveCursor(0, -process.stdout.rows)
        process.stdout.clearScreenDown()
      }
      if (input.toLowerCase().startsWith("status")) {
        log(`${prefix}Uptime: ${client.uptime}ms | Ping: ${client.ping}`, 86, 98, 246)
      }
      resolve(undefined)
    })
  }
  client.on("ready", async () => {
    log(`Connected to Discord! Logged in as ${client.user.tag} (${client.user.id})`, 86, 98, 246)
    if (config.activity.enabled) {
      client.user.setStatus(String(config.activity.type))
    }
    if (accnumber != undefined) {
      prefix = `[${client.user.tag}] `
    }
  })
  client.on("message", async msg => {
    if (config.control_server.enabled) {
      controlserver: {
        if (msg.channel.type == "text") {
          var idcheck = await doesinclude(msg.guild.id, config.control_server.cs_id, false, config.splitter)
          if (!idcheck) {
            break controlserver
          }
          if (config.control_server.enable_channel) {
            var channel = await doesinclude(msg.channel.id, config.control_server.cs_channel, false, config.splitter)
            if (!channel) {
              break controlserver
            }
          }
          if (config.control_server.enable_manager) {
            var manager = await doesinclude(msg.author.id, config.control_server.cs_manager, false, config.splitter)
            if (!manager) {
              break controlserver
            }
          }
          msg.content = msg.content.toLowerCase().replace(config.control_server.cs_prefix, '').trim()
          command(msg.content, "CS")
        }
      }
    }
    msg_create: {
      if (config.msg_create_event.enabled_server && msg.channel.type == "text") {
        if (config.msg_create_event.ignore_bots && msg.author.bot) {
         break msg_create
        }
        if (config.msg_create_event.notify) {
          var channel = `#${msg.channel.name} (${msg.channel.id}), ${msg.guild.name} (${msg.guild.id})`
          var message = await truncate(msg.content)
          log(`${prefix}Message Create Event: From ${msg.author.tag} in ${msg.guild.name}, #${msg.channel.name}: ${message}`, config.msg_create_event.notify_r, config.msg_create_event.notify_g, config.msg_create_event.notify_b)
        }
        if (config.msg_create_event.log) {
          try {var attachmentlink = msg.attachments.first().url}
          catch {var attachmentlink = "none"}
          var message = `Content: ${msg.content}\n\nAttachment url: ${attachmentlink}\n\nAuthor: ${msg.author.tag}, ${msg.author.id}\n\nChannel, Guild: ${channel}\n\nMessage sent time (unix): ${(msg.createdAt.getTime()/1000).toFixed(0)}`
          var date = await getfulldate(true)
          writefile(`.simplesniper/logs/msg_logs/msgcreate-${date}.txt`, message)
        }
      }
      if (config.msg_create_event.enabled_dm && msg.channel.type == 'dm') {
        if (config.msg_create_event.ignore_bots && msg.author.bot) {
          break msg_create
        }
        if (config.msg_create_event.notify) {
          var message = await truncate(msg.content)
          log(`${prefix}Message Create Event: From ${msg.author.tag} in Direct Messages: ${message}`, config.msg_create_event.notify_r, config.msg_create_event.notify_g, config.msg_create_event.notify_b)
        }
        if (config.msg_create_event.log) {
          try {var attachmentlink = msg.attachments.first().url}
          catch {var attachmentlink = "none"}
          var message = `Content: ${msg.content}\n\nAttachment url: ${attachmentlink}\n\nDM Author: ${msg.author.tag}, ${msg.author.id}\n\nMessage sent time (unix): ${(msg.createdAt.getTime()/1000).toFixed(0)}`
          var date = await getfulldate(true)
          writefile(`.simplesniper/logs/msg_logs/msgcreate-${date}.txt`, message)
        }
      }
    }
  })
  client.on('messageDelete', async msg => {
    if (config.msg_delete_event.enabled) {
      if (config.msg_delete_event.ignore_bots && msg.author.bot) {return}
      if (config.msg_delete_event.notify) {
        var message = await truncate(msg.content)
        if (msg.channel.type == 'dm') {
          var channel = "Direct Messages"
          log(`${prefix}Deleted Message Event: From ${msg.author.tag} in Direct Messages: ${message}`, config.msg_delete_event.notify_r, config.msg_delete_event.notify_g, config.msg_delete_event.notify_b)
        }
        else {
          var channel = `#${msg.channel.name} (${msg.channel.id}), ${msg.guild.name} (${msg.guild.id})`
          log(`${prefix}Deleted Message Event: From ${msg.author.tag} in ${msg.guild.name}, #${msg.channel.name}: ${message}`, config.msg_delete_event.notify_r, config.msg_delete_event.notify_g, config.msg_delete_event.notify_b)
        }
      }
      if (config.msg_delete_event.log) {
        try {var attachmentlink = msg.attachments.first().url}
        catch {var attachmentlink = "none"}
        var message = `Content: ${msg.content}\n\nAttachment url: ${attachmentlink}\n\nAuthor: ${msg.author.tag}, ${msg.author.id}\n\nChannel, Guild: ${channel}\n\nMessage sent time (unix): ${(msg.createdAt.getTime()/1000).toFixed(0)}`
        var date = await getfulldate(true)
        writefile(`.simplesniper/logs/msg_logs/msgdelete-${date}.txt`, message)
      }
    }
  })
  client.on("messageDeleteBulk", async msgs => {
    if (config.msg_purge_event.enabled) {
      if (config.msg_purge_event.notify) {
        if (msgs.first().channel.type == 'dm') {
          log(`${prefix}Message Purge Event: ${msgs.array().length} messages, first from ${msgs.first().author.tag} in Direct Messages`, config.msg_purge_event.notify_r, config.msg_purge_event.notify_g, config.msg_purge_event.notify_b) 
          // this notification will probably never occur but i might aswell keep it to prevent that one rare exception
        }
        else {
          log(`${prefix}Message Purge Event: ${msgs.array().length} messages, first in ${msgs.first().channel.name}, ${msgs.first().guild.name}`, config.msg_purge_event.notify_r, config.msg_purge_event.notify_g, config.msg_purge_event.notify_b)
        }
      }
      if (config.msg_delete_event.log) {
        msgs.map(async msg=>{
          if (config.msg_delete_event.notify) {
            if (msg.channel.type == 'dm') {
              var channel = "Direct Messages"
            }
            else {
              var channel = `#${msg.channel.name} (${msg.channel.id}), ${msg.guild.name} (${msg.guild.id})`
            }
          }
          try {var attachmentlink = msg.attachments.first().url}
          catch {var attachmentlink = "none"}
          var message = `Content: ${msg.content}\n\nAttachment url: ${attachmentlink}\n\nAuthor: ${msg.author.tag}, ${msg.author.id}\n\nChannel, Guild: ${channel}\n\nMessage sent time (unix): ${(msg.createdAt.getTime()/1000).toFixed(0)}`
          var date = await getfulldate(true)
          await writefile(`.simplesniper/logs/msg_logs/purge${msgs.array().indexOf(msg)}-${date}.txt`, message)
        })
      }
    }
  })
  client.on("messageUpdate", async (oldmsg, newmsg) => {
    if (config.msg_edit_event.enabled && newmsg.editedAt) {
      if (config.msg_edit_event.ignore_bots && oldmsg.author.bot) {return}
      if (config.msg_edit_event.notify) {
        var message = await truncate(newmsg.content)
        if (oldmsg.channel.type == 'dm') {
          var channel = "Direct Messages"
          log(`${prefix}Message Edit Event: From ${oldmsg.author.tag} in Direct Messages: ${message}`, config.msg_edit_event.notify_r, config.msg_edit_event.notify_g, config.msg_edit_event.notify_b)
        }
        else {
          var channel = `#${oldmsg.channel.name} (${oldmsg.channel.id}), ${oldmsg.guild.name} (${oldmsg.guild.id})`
          log(`${prefix}Message Edit Event: From ${oldmsg.author.tag} in ${oldmsg.guild.name}, #${oldmsg.channel.name}: ${message}`, config.msg_edit_event.notify_r, config.msg_edit_event.notify_g, config.msg_edit_event.notify_b)
        }
      }
      if (config.msg_edit_event.log) {
        try {var attachmentlink = oldmsg.attachments.first().url}
        catch {var attachmentlink = "none"}
        try {var attachmentlink2 = newmsg.attachments.first().url}
        catch {var attachmentlink2 = "none"}
        var message = `Content before: ${oldmsg.content}\n\nContent after: ${newmsg.content}\n\nAttachment url before: ${attachmentlink}\n\nAttachment url after: ${attachmentlink2}\n\nAuthor: ${oldmsg.author.tag}, ${oldmsg.author.id}\n\nChannel, Guild: ${channel}\n\nMessage sent time (unix): ${(oldmsg.createdAt.getTime()/1000).toFixed(0)}\n\nMessage edit time (unix): ${(newmsg.editedAt.getTime()/1000).toFixed(0)}`
        var date = await getfulldate(true)
        writefile(`.simplesniper/logs/msg_logs/edit-${date}.txt`, message)
      }
    }
  })
  client.on("guildBanAdd", async (server, member) => {
    if (config.guild_ban_event.enabled_self && member.id == client.user.id) {
      if (config.guild_ban_event.notify) {
        log(`${prefix}Guild Ban Event: You have been banned from ${server.name} (${server.id})`, config.guild_ban_event.notify_r, config.guild_ban_event.notify_g, config.guild_ban_event.notify_b)
      }
      if (config.guild_ban_event.log) {
        var date = await getfulldate(true)
        await writefile(`.simplesniper/logs/guild_logs/selfban-${date}.txt`, `Banned from: ${server.name}, ${server.id}\n\nServer owner: ${server.owner.id}`)
      }
    }
    if (config.guild_ban_event.enabled_others && member.id != client.user.id) {
      if (config.guild_ban_event.ignore_bots && member.bot) {return}
      if (config.guild_ban_event.notify) {
        log(`${prefix}Guild Ban Event: ${member.tag} (${member.id}) has been banned from ${server.name} (${server.id})`, config.guild_ban_event.notify_r, config.guild_ban_event.notify_g, config.guild_ban_event.notify_b)
      }
      if (config.guild_ban_event.log) {
        var date = await getfulldate(true)
        await writefile(`.simplesniper/logs/guild_logs/ban-${date}.txt`, `User: ${member.tag}, ${member.id}\n\nBanned from: ${server.name}, ${server.id}\n\nServer owner: ${server.owner.id}`)
      }
    }
  })
  client.on('guildDelete', async server => {
    if (config.guild_delete_event.enabled) {
      if (config.guild_delete_event.notify) {
        log(`${prefix}Guild Delete Event: ${server.name} (${server.id}) was removed from your server list`, config.guild_delete_event.notify_r, config.guild_delete_event.notify_g, config.guild_delete_event.notify_b)
      }
      if (config.guild_delete_event.log) {
        var date = await getfulldate(true)
        var ownerid
        if (server.owner.id) {
          ownerid = server.owner.id
        }
        else {
          ownerid = "does not exist, account possibly banned."
        }
        await writefile(`.simplesniper/logs/guild_logs/delete-${date}.txt`, `Deleted server: ${server.name}, ${server.id}\n\nServer owner: ${server.owner.id}`)
      }
    }
  })
  client.on('userNoteUpdate', async (user, oldnote, newnote) => {
    if (config.note_cmd.enabled_self && newnote) {
      command(newnote, "Note")
    }
  })
  client.on('messageReactionAdd', async (reaction, user) => {
    if (config.giveaway_sniper.enabled && reaction.count <= 1 && reaction.message.channel.type == 'text') {
      giveawaysniper: {
        if (config.giveaway_sniper.bot_check && !reaction.message.author.bot) { // garbage but works, atleast the config is very flexible
          break giveawaysniper
        }
        if (config.giveaway_sniper.enable_filter) {
          var check = await doesinclude(reaction.message.content, config.giveaway_sniper.filter, config.giveaway_sniper.filter_case_sensitive, config.splitter)
          if (!config.giveaway_sniper.invert_filter && !check || config.giveaway_sniper.invert_filter && check) {
            break giveawaysniper
          }
        }
        if (config.giveaway_sniper.enable_user_list) {
          var check = await doesinclude(reaction.message.author.id, config.giveaway_sniper.user_whitelist, false, config.splitter)
          if (!config.giveaway_sniper.invert_user_list && !check || config.giveaway_sniper.invert_user_list && check) {
            break giveawaysniper
          }
        }
        if (config.giveaway_sniper.enable_channel_list) {
          var check = await doesinclude(reaction.message.channel.id, config.giveaway_sniper.channel_whitelist, false, config.splitter)
          if (!config.giveaway_sniper.invert_channel_list && !check || config.giveaway_sniper.invert_channel_list && check) {
            break giveawaysniper
          }
        }
        var emoji = reaction.emoji
        if (config.giveaway_sniper.enable_emoji_list) {
          var check = await doesinclude(emoji, config.giveaway_sniper.emoji_whitelist, false, config.splitter)
          if (!config.giveaway_sniper.invert_emoji_list && !check || config.giveaway_sniper.invert_emoji_list && check) {
            break giveawaysniper
          }
        }
        var timeout = await rng(config.giveaway_sniper.delay_min, config.giveaway_sniper.delay_max, 0)
        if (config.giveaway_sniper.notify) {
          log(`${prefix}Giveaway Sniper: Entering giveaway in (${reaction.message.guild.name}, #${reaction.message.channel.name}) sent by ${reaction.message.author.tag} (${timeout}ms delay)`, config.giveaway_sniper.notify_r, config.giveaway_sniper.notify_g, config.giveaway_sniper.notify_b)
        }
        setTimeout(() => {
          reaction.message.react(emoji)
        }, timeout);
      }
    }
  })
  client.login(token)
}

// magical code to catch errors and prevent the script from crashing
process.on('unhandledRejection', error => {
  catchexception(error)
}) 
process.on('uncaughtException', error => {
  catchexception(error)
})

main()