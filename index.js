const Discord = require('legend.js');
const { writeFile, readFile } = require('fs');
const prompt = require('prompt-sync')()

async function log(content, r, g, b) {
  if (r && g && b) {
    var color = await rgbx1b(r, g, b)
  }
  else {
    var color = ''
  }
  var time = await getfulldate(false)
  console.log(`\x1b[90m[${time}] \x1b[96m>\x1b[0m ${color}${content}\x1b[0m`)
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
    var color = await rgbx1b(255, 75, 75)
    log(`${color}A exception has been caught. (${error})\x1b[0m`)
  }
  if (config.crash_handler.log) {
    var date = await getfulldate(true)
    writefile(`.simplesniper/logs/error_logs/error-${date}.txt`, error)
  }
}
var config
async function readconfig(notify) {
  if (notify) {log(`\x1b[33mReading config...\x1b[0m`)}
  var output = await readfile(".simplesniper/config.json") // had to do this because javascript hates being asynchronous
  config = JSON.parse(String(output))
  if (notify) {log(`\x1b[92mConfig read!\x1b[0m`)}
}
async function rng(min, max, decimal) {
  return new Promise(resolve =>{
    var number = Math.random() * (Number(max) - Number(min)) + Number(min)
    number = number.toFixed(Number(decimal))
    resolve(Number(number))
  })
}
async function doesinclude(checked, tocheck, casesensitive, splitter) {
  if (splitter == undefined) {
    splitter = "; "
  }
  if (casesensitive == undefined) {
    casesensitive = false
  }
  return new Promise(resolve =>{
    tocheck = String(tocheck).split(splitter)
    tocheck.forEach(string => {
      if (!casesensitive) {
        if (checked.toLowerCase().includes(string.toLowerCase())) {
          resolve(true)
        }
      }
      else {
        if (checked.includes(string)) {
          resolve(true)
        }
      }
    })
    resolve(false)
  })
}
async function rgbx1b(r, g, b) {
  return new Promise(resolve =>{
    resolve(`\x1B[38;2;${String(r)};${String(g)};${String(b)}m`)
  })
}

// main functions
async function main() {
  await readconfig(false)
  process.stdout.moveCursor(0, -process.stdout.rows)
  process.stdout.clearScreenDown()
  log(`\x1b[92mSimpleSniper-${config.version} initialized.\x1b[0m`)
  var token
  var launcharg = process.argv.slice(2)
  if (launcharg != '') {
    token = launcharg
    await log("\x1b[95mFound a launch argument, applying it as the token and starting.\x1b[0m")
  }
  else if (String(config.token).toLowerCase() == 'ask') {
    await log("\x1b[95mYour token is currently set to \"ask\", which means you need to manually input your token to start:")
    token = prompt()
    process.stdout.moveCursor(0, -process.stdout.rows)
    process.stdout.clearScreenDown() // thanks stackoverflow
    await log("\x1b[95mToken applied, proceeding with the launch.\x1b[0m")
  }
  else if (String(config.token).toLowerCase() == 'multirun') {
    await log("\x1b[95mYour token is currently set to \"multirun\", reading tokenlist.txt and logging in on all accounts...")
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
  log(`\x1b[33mConnecting to Discord servers...\x1b[0m`)
  auth(String(token))
}
async function auth(token, accnumber) {
  var prefix = ''
  const client = new Discord.Client()
  async function command(input, cmdtype) {
    return new Promise(async resolve => {
      if (input != undefined && cmdtype != undefined) {
        log(`${prefix}\x1b[95mRunning ${cmdtype} Command: ${input}\x1b[0m`)
      }
      if (input.toLowerCase().startsWith("load")) {
        await readconfig(true)
        return
      }
      if (input.toLowerCase().startsWith("exit")) {
        log(`${prefix}\x1b[Logging out of SimpleSniper.\x1b[0m`)
        client.destroy()
      }
      if (input.toLowerCase().startsWith("clear")) {
        process.stdout.moveCursor(0, -process.stdout.rows)
        process.stdout.clearScreenDown()
      }
      if (input.toLowerCase().startsWith("status")) {
        log(`${prefix}\x1b[Uptime: ${client.uptime}ms | Ping: ${client.ping}\x1b[0m`)
      }
      resolve(undefined)
    })
  }
  client.on("ready", () =>{
    log(`\x1b[92mConnected to Discord! Logged in as ${client.user.tag} (${client.user.id})\x1b[0m`)
    if (config.activity.enabled) {
      client.user.setStatus(String(config.activity.type))
    }
    if (accnumber != undefined) {
      prefix = `\x1b[96m[${client.user.tag}]\x1b[0m `
    }
  })
  client.on("message", async msg => {
    if (config.control_server.enabled) {
      if (msg.channel.type == "text" && config.control_server.cs_id == msg.guild.id) {
        if (config.control_server.enable_manager && config.control_server.cs_manager != msg.author.id) {
          return
        }
        if (config.control_server.enable_channel && config.control_server.cs_channel != msg.channel.id) {
          return
        }
        msg.content = msg.content.toLowerCase().replace(config.control_server.cs_prefix, '').trim()
        command(msg.content, "CS")
      }
    }
  })
  client.on('messageDelete', async msg => {
    if (config.msg_delete_event.enabled) {
      if (config.msg_delete_event.ignore_bots && msg.author.bot) {return}
      if (config.msg_delete_event.notify) {
        if (msg.channel.type == 'dm') {
          var channel = "Direct Messages"
          log(`${prefix}\x1b[95mDeleted Message Event: From ${msg.author.tag} in Direct Messages\x1b[0m`)
        }
        else {
          var channel = `#${msg.channel.name} (${msg.channel.id}), ${msg.guild.name} (${msg.guild.id})`
          log(`${prefix}\x1b[95mDeleted Message Event: From ${msg.author.tag} in ${msg.guild.name}, #${msg.channel.name}\x1b[0m`)
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
          log(`${prefix}\x1b[95mMessage Purge Event: ${msgs.array().length} messages, first from ${msgs.first().author.tag} in Direct Messages\x1b[0m`)
        }
        else {
          log(`${prefix}\x1b[95mMessage Purge Event: ${msgs.array().length} messages, first in ${msgs.first().channel.name}, ${msgs.first().guild.name}\x1b[0m`)
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
        if (oldmsg.channel.type == 'dm') {
          var channel = "Direct Messages"
          log(`${prefix}\x1b[95mMessage Edit Event: From ${oldmsg.author.tag} in Direct Messages\x1b[0m`)
        }
        else {
          var channel = `#${oldmsg.channel.name} (${oldmsg.channel.id}), ${oldmsg.guild.name} (${oldmsg.guild.id})`
          log(`${prefix}\x1b[95mMessage Edit Event: From ${oldmsg.author.tag} in ${oldmsg.guild.name}, #${oldmsg.channel.name}\x1b[0m`)
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
        log(`${prefix}\x1b[95mGuild Ban Event: You have been banned from ${server.name} (${server.id})\x1b[0m`)
      }
      if (config.guild_ban_event.log) {
        var date = await getfulldate(true)
        await writefile(`.simplesniper/logs/guild_logs/selfban-${date}.txt`, `Banned from: ${server.name}, ${server.id}\n\nServer owner: ${server.owner.id}`)
      }
    }
    if (config.guild_ban_event.enabled_others && member.id != client.user.id) {
      if (config.guild_ban_event.ignore_bots && member.bot) {return}
      if (config.guild_ban_event.notify) {
        log(`${prefix}\x1b[95mGuild Ban Event: ${member.tag} (${member.id}) has been banned from ${server.name} (${server.id})\x1b[0m`)
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
        log(`${prefix}\x1b[95mGuild Delete Event: ${server.name} (${server.id}) was removed from your server list\x1b[0m`)
      }
      if (config.guild_delete_event.log) {
        var date = await getfulldate(true)
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
    if (config.giveaway_sniper.enabled && reaction.count <= 1) {
      if (config.giveaway_sniper.bot_check && !reaction.message.author.bot) { // garbage but works, atleast the config is very flexible
        return
      }
      if (config.giveaway_sniper.enable_filter && !reaction.message.content.includes(config.giveaway_sniper.filter)) {
        return
      }
      if (config.giveaway_sniper.enable_user_list && !config.giveaway_sniper.invert_user_list && !config.giveaway_sniper.user_whitelist.includes(reaction.message.author.id)) {
        return
      }
      if (config.giveaway_sniper.enable_user_list && config.giveaway_sniper.invert_user_list && config.giveaway_sniper.user_whitelist.includes(reaction.message.author.id)) {
        return
      }
      if (config.giveaway_sniper.enable_channel_list && !config.giveaway_sniper.invert_channel_list && !config.giveaway_sniper.channel_whitelist.includes(reaction.message.channel.id)) {
        return
      }
      if (config.giveaway_sniper.enable_channel_list && config.giveaway_sniper.invert_channel_list && config.giveaway_sniper.channel_whitelist.includes(reaction.message.channel.id)) {
        return
      }
      var emoji = reaction.emoji
      if (config.giveaway_sniper.enable_emoji_list && !config.giveaway_sniper.invert_emoji_list && !config.giveaway_sniper.emoji_whitelist.includes(emoji)) {
        return
      }
      if (config.giveaway_sniper.enable_emoji_list && config.giveaway_sniper.invert_emoji_list && config.giveaway_sniper.emoji_whitelist.includes(emoji)) {
        return
      }
      var timeout = await rng(config.giveaway_sniper.delay_min, config.giveaway_sniper.delay_max, 0)
      if (config.giveaway_sniper.notify) {
        log(`${prefix}\x1b[95mGiveaway Sniper: Joining giveaway in ${reaction.message.guild.name} (${reaction.message.guild.id}) sent by ${reaction.message.author.tag}, with ${timeout}ms delay\x1b[0m`)
      }
      setTimeout(() => {
        reaction.message.react(emoji)
      }, timeout);
    }
  })
  client.login(token)
}

// magical code to catch errors and prevent the script from crashing
process.on('unhandledRejection', error => {
  if (config.crash_handler.enabled) {
    catchexception(error)
  }
}) 
process.on('uncaughtException', error => {
  if (config.crash_handler.enabled) {
    catchexception(error)
  }
})

main()