const Discord = require('legend.js');
const { writeFile, readFile, appendFile, existsSync } = require('fs');
const readlinesync = require('readline-sync');

async function notif(content, r, g, b) {
  var color = await rgbx1b(r, g, b)
  var time = await getfulldate(false)
  console.log(`\x1B[38;2;87;90;96m[${time}]\x1b[0m ${color}${content}\x1b[0m`)
}
async function log(content) {
  var time = await getfulldate(false)
  if (!existsSync(`.simplesniper/log.txt`)) {
    await writefile(`.simplesniper/log.txt`, `[${time}] ${content}`)
  }
  else {
    await appendfile(`.simplesniper/log.txt`, `\n[${time}] ${content}`)
  }
}
function getfulldate(shitdowscompatibility) { 
  return new Promise (resolve => {
    var date = new Date
    var day = date.getDate()
    if (day.toString().length < 2) {
      day = "0" + day
    }
    var month = date.getMonth() + 1
    if (month.toString().length < 2) {
      month = "0" + month
    }
    var minute = date.getMinutes() 
    if (minute.toString().length < 2) {
      minute = "0" + minute
    }
    var hour = date.getHours()
    if (hour.toString().length < 2) {
      hour = "0" + hour
    }
    var seconds = date.getSeconds()
    if (seconds.toString().length < 2) {
      seconds = "0" + seconds
    }
    var ms = date.getMilliseconds()
    if (ms.toString().length < 2) {
      ms = "0" + ms
    }
    if (ms.toString().length < 3) {
      ms = "0" + ms
    }
    if (config.american_dates) {
      var daymonth = `${month}-${day}`
    }
    else {
      var daymonth = `${day}-${month}`
    }
    if (shitdowscompatibility) {
      resolve(`${daymonth}-${date.getFullYear()}_${hour}-${minute}-${seconds}.${ms}`)
    }
    else {
      resolve(`${daymonth}-${date.getFullYear()} ${hour}:${minute}:${seconds}.${ms}`)
    }
  })
}
function writefile(path, content) {
  return new Promise (resolve => {
    writeFile(`${String(path)}`, String(content), (error) => {
      if (error) {
        resolve(undefined)
      }
      resolve(true)
    })
  })
}
function appendfile(path, content) {
  return new Promise (resolve => {
    appendFile(`${String(path)}`, String(content), (error) => {
      if (error) {
        resolve(undefined)
      }
      resolve(true)
    })
  })
}
function readfile(path) {
  return new Promise (resolve => {
    readFile(`${String(path)}`, "utf8", function(err, data) {
      if (err) {
        resolve(false)
      }
      resolve(data)
    })
  })
}
async function catchexception(error) {
  if (config.crash_handler.notify) {
    notif(`A exception has been caught. (${error})`, 255, 75, 75)
  }
  if (config.crash_handler.log) {
    log(`A exception has been caught. (${error})`)
  }
}
var config
async function readconfig(notify) {
  if (notify) {
    notif(`\x1b[33mReading config...`), 86, 98, 246
  }
  var output = await readfile(".simplesniper/config.json")
  config = JSON.parse(String(output))
  if (notify) {
    notif(`\x1b[92mConfig read!`), 86, 98, 246
  }
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
async function getattachments(msg) {
  return new Promise(resolve =>{
    var attachments = ''
    var counter = 0
    msg.attachments.map(async attachment => {
      if (counter == 0) {
        attachments += attachment.url
      }
      else {
        attachments += `, ${attachment.url}`
      }
      counter++
    })
    if (counter == 0) {
      attachments = "no attachments"
    }
    resolve(attachments)
  })
}
async function getchannelinfo(msg, simple) {
  return new Promise(resolve =>{
    if (msg.channel.type == 'dm') {
      resolve("Direct Messages")
    }
    else {
      if (simple) {
        resolve(`${msg.guild.name}, #${msg.channel.name}`)
      }
      else {
        resolve(`${msg.guild.name} (${msg.guild.id}), #${msg.channel.name} (${msg.channel.id})`)
      }
    }
  })
}
async function removenewlines(string) {
  return new Promise(resolve =>{
    var output = String(string).split("\n")
    output = output.join("   ")
    resolve(String(output))
  })
}

// main functions
async function main() {
  await readconfig(false)
  if (config.clear_cli_on_start) {
    process.stdout.moveCursor(0, -process.stdout.rows)
    process.stdout.clearScreenDown()
  }
  notif(`SimpleSniper-${config.version} initialized.`, 86, 98, 246)
  var token
  var launcharg = process.argv.slice(2)
  if (launcharg != '') {
    token = launcharg
    await notif("Found a launch argument, applying it as the token and starting.", 86, 98, 246)
  }
  else if (String(config.token).toLowerCase() == 'ask') {
    await notif("Your token is currently set to \"ask\", please input your token to start: ", 86, 98, 246)
    token = readlinesync.question("")
    var linecount = 0, lines = String(token)
    while (lines.length > 0) {
      if (linecount >= 250) {
        break
      }
      lines = lines.slice(process.stdout.columns)
      linecount += 1
    } 
    process.stdout.moveCursor(0, -linecount)
    process.stdout.clearScreenDown()
    await notif("Token applied, proceeding with the launch.", 86, 98, 246)
  }
  else {
    token = config.token
  }
  auth(String(token))
}
async function auth(token) {
  const client = new Discord.Client()
  async function command(input, cmdtype) {
    return new Promise(async resolve => {
      if (input.toLowerCase().startsWith("load")) {
        notif(`Running ${cmdtype} Command: ${input}`, 86, 98, 246)
        await readconfig(true)
        return
      }
      if (input.toLowerCase().startsWith("logout")) {
        notif(`Running ${cmdtype} Command: ${input}`, 86, 98, 246)
        notif(`Logging ${client.user.tag} out of SimpleSniper.`, 86, 98, 246)
        client.removeAllListeners()
        client.destroy()
      }
      if (input.toLowerCase().startsWith("exit")) {
        notif(`Running ${cmdtype} Command: ${input}`, 86, 98, 246)
        notif(`Exiting SimpleSniper.`, 86, 98, 246)
        client.destroy()
        process.exit(0)
      }
      if (input.toLowerCase().startsWith("clear")) {
        process.stdout.moveCursor(0, -process.stdout.rows)
        process.stdout.clearScreenDown()
      }
      if (input.toLowerCase().startsWith("status")) {
        notif(`Running ${cmdtype} Command: ${input}`, 86, 98, 246)
        notif(`Uptime: ${client.uptime}ms | Ping: ${client.ping}`, 86, 98, 246)
      }
      if (input.toLowerCase().startsWith("login")) {
        notif(`Running ${cmdtype} Command: ${String(input).split(" ").shift()}`, 86, 98, 246)
        var formattedtoken = String(input).split(" ").pop().trim()
        if (!String(input).includes(" ")) {
          notif(`You need to provide a token to be used with the command.`, 86, 98, 246)
          return
        }
        else if (formattedtoken == token) {
          notif(`Provided token is already used.`, 86, 98, 246)
          return
        }
        else {
          auth(formattedtoken)
        }
      }
      resolve(undefined)
    })
  }

  process.stdin.on("data", async data => {
    var linecount = 0, lines = String(data)
    while (lines.length > 0) {
      if (linecount >= 250) {
        break
      }
      lines = lines.slice(process.stdout.columns)
      linecount += 1
    } 
    process.stdout.moveCursor(0, -linecount)
    process.stdout.clearScreenDown()
    command(String(data).trim(), "CLI")
  })
  
  client.on("ready", async () => {
    notif(`Connected to Discord! Logged in as ${client.user.tag} (${client.user.id})`, 86, 98, 246)
    if (config.activity.enabled) {
      client.user.setStatus(String(config.activity.type))
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
      if (config.msg_create_event.ignore_bots && msg.author.bot) {
        break msg_create
      }
      if (config.msg_create_event.enabled_server && msg.channel.type == "text" || config.msg_create_event.enabled_dm && msg.channel.type == 'dm') {
        if (config.msg_create_event.enable_filter) {
          var check = await doesinclude(msg.content, config.msg_create_event.filter, config.msg_create_event.filter_case_sensitive, config.splitter)
          if (!config.msg_create_event.invert_filter && !check || config.msg_create_event.invert_filter && check) {
            return
          }
        }
        if (config.msg_create_event.enable_user_list) {
          var check = await doesinclude(msg.author.id, config.msg_create_event.user_whitelist, false, config.splitter)
          if (!config.msg_create_event.invert_user_list && !check || config.msg_create_event.invert_user_list && check) {
            return
          }
        }
        if (config.msg_create_event.enable_channel_list) {
          var check = await doesinclude(msg.channel.id, config.msg_create_event.channel_whitelist, false, config.splitter)
          if (!config.msg_create_event.invert_channel_list && !check || config.msg_create_event.invert_channel_list && check) {
            return
          }
        }
        if (config.msg_create_event.enable_guild_list) {
          var check = await doesinclude(msg.guild.id, config.msg_create_event.guild_whitelist, false, config.splitter)
          if (!config.msg_create_event.invert_guild_list && !check || config.msg_create_event.invert_guild_list && check) {
            return
          }
        }
        if (config.msg_create_event.notify) {
          var message = await removenewlines(msg.content)
          message = await truncate(message)
          var simpleinfo = await getchannelinfo(msg, true)
          notif(`Message Create: From ${msg.author.tag} in ${simpleinfo}: ${message}`, config.msg_create_event.notify_r, config.msg_create_event.notify_g, config.msg_create_event.notify_b)
        }
        if (config.msg_create_event.log) {
          var attachments = await getattachments(msg)
          var channelinfo = await getchannelinfo(msg)
          var message = await removenewlines(msg.content)
          await log(`Message Create: From ${msg.author.tag} (${msg.author.id}) in ${channelinfo}, sent at ${(msg.createdAt.getTime()/1000).toFixed(0)} with {${attachments}} attached: ${message}`)
        }
      }
    }
  })

  client.on('messageDelete', async msg => {
    if (config.msg_delete_event.enabled) {
      if (config.msg_delete_event.ignore_bots && msg.author.bot) {return}
      if (config.msg_delete_event.enable_filter) {
        var check = await doesinclude(msg.content, config.msg_delete_event.filter, config.msg_delete_event.filter_case_sensitive, config.splitter)
        if (!config.msg_delete_event.invert_filter && !check || config.msg_delete_event.invert_filter && check) {
          return
        }
      }
      if (config.msg_delete_event.enable_user_list) {
        var check = await doesinclude(msg.author.id, config.msg_delete_event.user_whitelist, false, config.splitter)
        if (!config.msg_delete_event.invert_user_list && !check || config.msg_delete_event.invert_user_list && check) {
          return
        }
      }
      if (config.msg_delete_event.enable_channel_list) {
        var check = await doesinclude(msg.channel.id, config.msg_delete_event.channel_whitelist, false, config.splitter)
        if (!config.msg_delete_event.invert_channel_list && !check || config.msg_delete_event.invert_channel_list && check) {
          return
        }
      }
      if (config.msg_delete_event.enable_guild_list) {
        var check = await doesinclude(msg.guild.id, config.msg_delete_event.guild_whitelist, false, config.splitter)
        if (!config.msg_delete_event.invert_guild_list && !check || config.msg_delete_event.invert_guild_list && check) {
          return
        }
      }
      if (config.msg_delete_event.notify) {
        var message = await removenewlines(msg.content)
        message = await truncate(message)
        var channelinfo = await getchannelinfo(msg, true)
        notif(`Message Delete: From ${msg.author.tag} in ${channelinfo}: ${message}`, config.msg_delete_event.notify_r, config.msg_delete_event.notify_g, config.msg_delete_event.notify_b)
      }
      if (config.msg_delete_event.log) {
        var attachments = await getattachments(msg)
        var channelinfo = await getchannelinfo(msg)
        var message = await removenewlines(msg.content)
        await log(`Message Delete: From ${msg.author.tag} (${msg.author.id}) in ${channelinfo}, sent at ${(msg.createdAt.getTime()/1000).toFixed(0)} with {${attachments}} attached: ${message}`)
      }
    }
  })

  client.on("messageDeleteBulk", async msgs => {
    if (config.msg_purge_event.enabled) {
      msgs.map(async msg=>{
        if (config.msg_purge_event.ignore_bots && msg.author.bot) {return}
        if (config.msg_purge_event.enable_filter) {
          var check = await doesinclude(msg.content, config.msg_purge_event.filter, config.msg_purge_event.filter_case_sensitive, config.splitter)
          if (!config.msg_purge_event.invert_filter && !check || config.msg_purge_event.invert_filter && check) {
            return
          }
        }
        if (config.msg_purge_event.enable_user_list) {
          var check = await doesinclude(msg.author.id, config.msg_purge_event.user_whitelist, false, config.splitter)
          if (!config.msg_purge_event.invert_user_list && !check || config.msg_purge_event.invert_user_list && check) {
            return
          }
        }
        if (config.msg_purge_event.enable_channel_list) {
          var check = await doesinclude(msg.channel.id, config.msg_purge_event.channel_whitelist, false, config.splitter)
          if (!config.msg_purge_event.invert_channel_list && !check || config.msg_purge_event.invert_channel_list && check) {
            return
          }
        }
        if (config.msg_purge_event.enable_guild_list) {
          var check = await doesinclude(msg.guild.id, config.msg_purge_event.guild_whitelist, false, config.splitter)
          if (!config.msg_purge_event.invert_guild_list && !check || config.msg_purge_event.invert_guild_list && check) {
            return
          }
        }
        if (config.msg_purge_event.notify) {
          var message = await removenewlines(msg.content)
          message = await truncate(message)
          var channelinfo = await getchannelinfo(msg, true)
          notif(`Message Purge: From ${msg.author.tag} (${msg.author.id}) in ${channelinfo}: ${message}`, config.msg_purge_event.notify_r, config.msg_purge_event.notify_g, config.msg_purge_event.notify_b)
        }
        if (config.msg_purge_event.log) {
          var attachments = await getattachments(msg)
          var channelinfo = await getchannelinfo(msg)
          var message = await removenewlines(msg.content)
          await log(`Message Purge: From ${msg.author.tag} (${msg.author.id}) in ${channelinfo}, sent at ${(msg.createdAt.getTime()/1000).toFixed(0)} with {${attachments}} attached: ${message}`)
        }
      })
    }
  })

  client.on("messageUpdate", async (oldmsg, newmsg) => {
    if (config.msg_edit_event.enabled && newmsg.editedAt) {
      if (config.msg_edit_event.ignore_bots && oldmsg.author.bot) {return}
      if (config.msg_edit_event.enable_filter) {
        var check = await doesinclude(oldmsg.content, config.msg_edit_event.filter, config.msg_edit_event.filter_case_sensitive, config.splitter)
        if (!config.msg_edit_event.invert_filter && !check || config.msg_edit_event.invert_filter && check) {
          return
        }
      }
      if (config.msg_edit_event.enable_user_list) {
        var check = await doesinclude(oldmsg.author.id, config.msg_edit_event.user_whitelist, false, config.splitter)
        if (!config.msg_edit_event.invert_user_list && !check || config.msg_edit_event.invert_user_list && check) {
          return
        }
      }
      if (config.msg_edit_event.enable_channel_list) {
        var check = await doesinclude(oldmsg.channel.id, config.msg_edit_event.channel_whitelist, false, config.splitter)
        if (!config.msg_edit_event.invert_channel_list && !check || config.msg_edit_event.invert_channel_list && check) {
          return
        }
      }
      if (config.msg_edit_event.enable_guild_list) {
        var check = await doesinclude(oldmsg.guild.id, config.msg_edit_event.guild_whitelist, false, config.splitter)
        if (!config.msg_edit_event.invert_guild_list && !check || config.msg_edit_event.invert_guild_list && check) {
          return
        }
      }
      if (config.msg_edit_event.notify) {
        var message = await removenewlines(newmsg.content)
        message = await truncate(message)
        var channelinfo = await getchannelinfo(oldmsg, true)
        notif(`Message Edit: From ${oldmsg.author.tag} in ${channelinfo}: ${message}`, config.msg_edit_event.notify_r, config.msg_edit_event.notify_g, config.msg_edit_event.notify_b)
      }
      if (config.msg_edit_event.log) {
        var attachmentsold = await getattachments(oldmsg)
        var channelinfoold = await getchannelinfo(oldmsg)
        var attachmentsnew = await getattachments(newmsg)
        var oldmessage = await removenewlines(oldmsg.content)
        var newmessage = await removenewlines(newmsg.content)
        await log(`Message Edit: From ${oldmsg.author.tag} (${oldmsg.author.id}) in ${channelinfoold}, sent at ${(oldmsg.createdAt.getTime()/1000).toFixed(0)}, edited at ${(newmsg.editedAt.getTime()/1000).toFixed(0)} with {${attachmentsold}} attached before and {${attachmentsnew}} attached after: old content: {${oldmessage}}, new content: {${newmessage}}`)
      }
    }
  })

  client.on("guildBanAdd", async (server, member) => {
    if (config.guild_ban_event.enabled_self && member.id == client.user.id) {
      if (config.guild_ban_event.enable_guild_list) {
        var check = await doesinclude(server.id, config.guild_ban_event.guild_whitelist, false, config.splitter)
        if (!config.guild_ban_event.invert_guild_list && !check || config.guild_ban_event.invert_guild_list && check) {
          return
        }
      }
      if (config.guild_ban_event.notify) {
        notif(`Guild Ban: You have been banned from ${server.name} (${server.id})`, config.guild_ban_event.notify_r, config.guild_ban_event.notify_g, config.guild_ban_event.notify_b)
      }
      if (config.guild_ban_event.log) {
        log(`Guild Ban: You have been banned from ${server.name} (${server.id})`)
      }
    }
    if (config.guild_ban_event.enabled_others && member.id != client.user.id) {
      if (config.guild_ban_event.ignore_bots && member.bot) {return}
      if (config.guild_ban_event.enable_user_list) {
        var check = await doesinclude(member.id, config.guild_ban_event.user_whitelist, false, config.splitter)
        if (!config.guild_ban_event.invert_user_list && !check || config.guild_ban_event.invert_user_list && check) {
          return
        }
      }
      if (config.guild_ban_event.enable_guild_list) {
        var check = await doesinclude(server.id, config.guild_ban_event.guild_whitelist, false, config.splitter)
        if (!config.guild_ban_event.invert_guild_list && !check || config.guild_ban_event.invert_guild_list && check) {
          return
        }
      }
      if (config.guild_ban_event.notify) {
        notif(`Guild Ban: ${member.tag} (${member.id}) has been banned from ${server.name} (${server.id})`, config.guild_ban_event.notify_r, config.guild_ban_event.notify_g, config.guild_ban_event.notify_b)
      }
      if (config.guild_ban_event.log) {
        log(`Guild Ban: ${member.tag} (${member.id}) has been banned from ${server.name} (${server.id})`)
      }
    }
  })

  client.on('guildDelete', async server => {
    if (config.guild_delete_event.enabled) {
      if (config.guild_delete_event.enable_guild_list) {
        var check = await doesinclude(server.id, config.guild_delete_event.guild_whitelist, false, config.splitter)
        if (!config.guild_delete_event.invert_guild_list && !check || config.guild_delete_event.invert_guild_list && check) {
          return
        }
      }
      if (config.guild_delete_event.notify) {
        notif(`Guild Delete: ${server.name} (${server.id}) was removed from your server list.`, config.guild_delete_event.notify_r, config.guild_delete_event.notify_g, config.guild_delete_event.notify_b)
      }
      if (config.guild_delete_event.log) {
        log(`Guild Delete: ${server.name} (${server.id}) was removed from your server list (kicked, or server got deleted/terminated).`)
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
        if (config.giveaway_sniper.bot_check && !reaction.message.author.bot) {
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
          notif(`Giveaway Sniper: Entering giveaway in (${reaction.message.guild.name}, #${reaction.message.channel.name}) sent by ${reaction.message.author.tag} (${timeout}ms delay)`, config.giveaway_sniper.notify_r, config.giveaway_sniper.notify_g, config.giveaway_sniper.notify_b)
        }
        if (config.giveaway_sniper.log) {
          log(`Giveaway Sniper: Entering giveaway in (${reaction.message.guild.name}, #${reaction.message.channel.name}) sent by ${reaction.message.author.tag} (${timeout}ms delay)`)
        }
        setTimeout(() => {
          reaction.message.react(emoji)
        }, timeout);
      }
    }
  })
  process.stdin.resume()
  process.stdin.setEncoding("utf8")
  process.stdout.setEncoding("utf8")
  client.login(token)
}

process.on('unhandledRejection', error => {
  catchexception(error)
}) 
process.on('uncaughtException', error => {
  catchexception(error)
})

main()