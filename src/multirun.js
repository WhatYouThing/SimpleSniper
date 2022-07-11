const Discord = require('legend.js');
const { writeFile, readFile, appendFile, existsSync } = require('fs');

async function notif(content, r, g, b) {
  var color = await rgbx1b(r, g, b)
  var time = await getfulldate(false)
  console.log(`\x1B[38;2;87;90;96m[${time}]\x1b[0m ${color}${content}\x1b[0m`)
}
async function log(content) {
  var time = await getfulldate(false)
  if (!existsSync(`.simplesniper/multirun/log.txt`)) {
    await writefile(`.simplesniper/multirun/log.txt`, `[${time}] ${content}`)
  }
  else {
    await appendfile(`.simplesniper/multirun/log.txt`, `\n[${time}] ${content}`)
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
async function readconfig() {
  var output = await readfile(".simplesniper/multirun/config.json") 
  config = JSON.parse(String(output))
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
        attachments = attachments + attachment.url
      }
      else {
        attachments = attachments + `, ${attachment.url}`
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

async function main() {
    await readconfig()
    if (config.clear_cli_on_start) {
        process.stdout.moveCursor(0, -process.stdout.rows)
        process.stdout.clearScreenDown()
    }
    await notif(`SimpleSniper-${config.version} multirun initialized.`, 86, 98, 246)
    await notif("Reading tokenlist.txt and logging in on all accounts...", 86, 98, 246)
    var tokenlist = await readfile(".simplesniper/multirun/tokenlist.txt")
    var token = String(tokenlist).split('\n')
    var tokencount = 0
    for (var i of token) {
        tokencount += 1
        auth(String(i).trim(), tokencount)
    }
    return
}
async function auth(token, accnumber) {
  var prefix = ''
  const client = new Discord.Client()

  client.on("ready", async () => {
    if (config.activity.enabled) {
      client.user.setStatus(String(config.activity.type))
    }
    if (accnumber != undefined) {
      prefix = `[${client.user.tag} (${accnumber})] `
      notif(`${client.user.tag} connected to discord.`, 86, 98, 246)
      log(`${client.user.tag} connected to discord.`)
    }
  })

  client.on("message", async msg => {
    msg_create: {
      if (config.msg_create_event.enabled_dm && msg.channel.type == 'dm') {
        if (config.msg_create_event.ignore_bots && msg.author.bot) {
          break msg_create
        }
        if (config.msg_create_event.notify) {
          var message = await removenewlines(msg.content)
          message = await truncate(message)
          notif(`${prefix}Message Create: From ${msg.author.tag} in Direct Messages: ${message}`, config.msg_create_event.notify_r, config.msg_create_event.notify_g, config.msg_create_event.notify_b)
        }
        if (config.msg_create_event.log) {
          var attachments = await getattachments(msg)
          var channelinfo = await getchannelinfo(msg)
          var message = await removenewlines(msg.content)
          await log(`${prefix}Message Create: From ${msg.author.tag} (${msg.author.id}) in ${channelinfo}, sent at ${(msg.createdAt.getTime()/1000).toFixed(0)} with {${attachments}} attached: ${message}`)
        }
      }
    }
  })

  client.on("guildBanAdd", async (server, member) => {
    if (config.guild_ban_event.enabled_self && member.id == client.user.id) {
      if (config.guild_ban_event.notify) {
        notif(`${prefix}Guild Ban: You have been banned from ${server.name} (${server.id})`, config.guild_ban_event.notify_r, config.guild_ban_event.notify_g, config.guild_ban_event.notify_b)
      }
      if (config.guild_ban_event.log) {
        log(`${prefix}Guild Ban: You have been banned from ${server.name} (${server.id})`)
      }
    }
    if (config.guild_ban_event.enabled_others && member.id != client.user.id) {
      if (config.guild_ban_event.ignore_bots && member.bot) {return}
      if (config.guild_ban_event.notify) {
        notif(`${prefix}Guild Ban: ${member.tag} (${member.id}) has been banned from ${server.name} (${server.id})`, config.guild_ban_event.notify_r, config.guild_ban_event.notify_g, config.guild_ban_event.notify_b)
      }
      if (config.guild_ban_event.log) {
        log(`${prefix}Guild Ban: ${member.tag} (${member.id}) has been banned from ${server.name} (${server.id})`)
      }
    }
  })

  client.on('guildDelete', async server => {
    if (config.guild_delete_event.enabled) {
      if (config.guild_delete_event.notify) {
        notif(`${prefix}Guild Delete: ${server.name} (${server.id}) was removed from your server list.`, config.guild_delete_event.notify_r, config.guild_delete_event.notify_g, config.guild_delete_event.notify_b)
      }
      if (config.guild_delete_event.log) {
        log(`${prefix}Guild Delete: ${server.name} (${server.id}) was removed from your server list (kicked, or server got deleted/terminated).`)
      }
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
          notif(`${prefix}Giveaway Sniper: Entering giveaway in (${reaction.message.guild.name}, #${reaction.message.channel.name}) sent by ${reaction.message.author.tag} (${timeout}ms delay)`, config.giveaway_sniper.notify_r, config.giveaway_sniper.notify_g, config.giveaway_sniper.notify_b)
        }
        if (config.giveaway_sniper.log) {
          log(`${prefix}Giveaway Sniper: Entering giveaway in (${reaction.message.guild.name}, #${reaction.message.channel.name}) sent by ${reaction.message.author.tag} (${timeout}ms delay)`)
        }
        setTimeout(() => {
          reaction.message.react(emoji)
        }, timeout);
      }
    }
  })
  process.stdout.setEncoding("utf8")
  client.login(token)
  .catch(err => {
    notif(`Token at line ${accnumber} encountered a error.`, 255, 75, 75)
    log(`Token at line ${accnumber} encountered a error.`)
  })
}

process.on('unhandledRejection', error => {
  catchexception(error)
}) 
process.on('uncaughtException', error => {
  catchexception(error)
})

main()