const Discord = require('legend.js');
const { writeFile, readFile } = require('fs');
const client = new Discord.Client()

async function log(content) {
  var time = await getfulldate(false)
  console.log(`\x1b[90m[${time}] \x1b[96m>\x1b[0m ` + content)
}
function getfulldate(shitdowscompatibility) { // returns the day, month, year, and the current time.
  return new Promise (resolve => {
    var date = new Date
    var output
    var day = date.getDate()
    if (day < 10) {day = "0" + day}
    var month = date.getMonth() + 1
    if (month < 10) {month = "0" + month}
    var minute = date.getMinutes() // simple fix for javascript returning single digits like 0:0 instead of 00:00
    if (minute < 10) {minute = "0" + minute}
    var hour = date.getHours()
    if (hour < 10) {hour = "0" + hour}
    var seconds = date.getSeconds()
    if (seconds < 10) {seconds = "0" + seconds}
    var ms = date.getMilliseconds()
    if (ms < 100) {ms = ms + "0"}
    if (Boolean(shitdowscompatibility)) {
      output = `${day}-${month}-${date.getFullYear()}_${hour}-${minute}-${seconds}.${ms}`
    }
    else {
      output = `${day}-${month}-${date.getFullYear()} ${hour}:${minute}:${seconds}.${ms}`
    }
    resolve(output)
  })
}
function writefile(path, file, content) {
  return new Promise (resolve => {
    writeFile(`${String(path)}/${String(file)}`, String(content), (error) => {
      if (error) {catchexception(error)}
      resolve(undefined)
    })
  })
}
function readfile(path, file) {
  return new Promise (resolve => {
    readFile(`${String(path)}/${String(file)}`, "utf8", function(err, data) {resolve(data)})
  })
}
async function catchexception(error) {
  log("\x1b[31mA exception has been caught, logging error information to logs/error_logs.\x1b[0m")
  var date = await getfulldate(true)
  writefile('.simplesniper/logs/error_logs', `error-${date}.txt`, error)
}
var config
async function readtoken() {
  log(`\x1b[33mScript loaded! Reading config...\x1b[0m`)
  var output = await readfile(".simplesniper", "config.json") // had to do this because javascript hates being asynchronous
  config = JSON.parse(String(output))
  log(`\x1b[33mConfig read! Connecting to Discord servers...\x1b[0m`)
  client.login(String(config.token))
  .catch(err=>{
    catchexception(err)
    log("\x1b[31mThe provided account token might be invalid. Make sure your config file contains a correct account token.\x1b[0m")
  })
}

client.on("ready", () =>{
  log(`\x1b[92mConnected to Discord! Logged in as: ${client.user.tag} (${client.user.id})\x1b[0m`)
  client.user.setStatus(String(config.activity))
})

client.on('messageDelete', async msg => {
  if (config.msg_delete_event.enabled == true) {
    if (config.msg_delete_event.notify == true) {
      if (msg.channel.type == 'dm') {
        var channel = "Direct Messages"
        log(`\x1b[95mDeleted Message Event: From ${msg.author.tag} in Direct Messages\x1b[0m`)
      }
      else {
        var channel = `#${msg.channel.name} (${msg.channel.id}), ${msg.guild.name} (${msg.guild.id})`
        log(`\x1b[95mDeleted Message Event: From ${msg.author.tag} in ${msg.guild.name}, #${msg.channel.name}\x1b[0m`)
      }
    }
    if (config.msg_delete_event.log == true) {
      try {var attachmentlink = msg.attachments.first().url}
      catch {var attachmentlink = "none"}
      var message = `Content: ${msg.content}\n\nAttachment url: ${attachmentlink}\n\nAuthor: ${msg.author.tag}, ${msg.author.id}\n\nChannel, Guild: ${channel}\n\nMessage sent time (unix): ${(msg.createdAt.getTime()/1000).toFixed(0)}`
      var date = await getfulldate(true)
      writefile(".simplesniper/logs/msg_logs", `msgdelete-${date}.txt`, message)
    }
  }
})

client.on("messageDeleteBulk", async msgs => {
  if (config.msg_purge_event.enabled == true) {
    if (config.msg_purge_event.notify == true) {
      if (msgs.first().channel.type == 'dm') {
        log(`\x1b[95mMessage Purge Event: ${msgs.array().length} messages, first from ${msgs.first().author.tag} in Direct Messages\x1b[0m`)
      }
      else {
        log(`\x1b[95mMessage Purge Event: ${msgs.array().length} messages, first in ${msgs.first().channel.name}, ${msgs.first().guild.name}\x1b[0m`)
      }
    }
    if (config.msg_delete_event.log == true) {
      msgs.map(async msg=>{
        if (config.msg_delete_event.notify == true) {
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
        await writefile(".simplesniper/logs/msg_logs", `purge${msgs.array().indexOf(msg)}-${date}.txt`, message)
      })
    }
  }
})

client.on("messageUpdate", async (oldmsg, newmsg) => {
  if (config.msg_edit_event.enabled == true) {
    if (config.msg_edit_event.notify == true) {
      if (oldmsg.channel.type == 'dm') {
        var channel = "Direct Messages"
        log(`\x1b[95mMessage Edit Event: From ${oldmsg.author.tag} in Direct Messages\x1b[0m`)
      }
      else {
        var channel = `#${oldmsg.channel.name} (${oldmsg.channel.id}), ${oldmsg.guild.name} (${oldmsg.guild.id})`
        log(`\x1b[95mMessage Edit Event: From ${oldmsg.author.tag} in ${oldmsg.guild.name}, #${oldmsg.channel.name}\x1b[0m`)
      }
    }
    if (config.msg_edit_event.log == true) {
      try {var attachmentlink = oldmsg.attachments.first().url}
      catch {var attachmentlink = "none"}
      try {var attachmentlink2 = newmsg.attachments.first().url}
      catch {var attachmentlink2 = "none"}
      var message = `Content before: ${oldmsg.content}\n\nContent after: ${newmsg.content}\n\nAttachment url before: ${attachmentlink}\n\nAttachment url after: ${attachmentlink2}\n\nAuthor: ${oldmsg.author.tag}, ${oldmsg.author.id}\n\nChannel, Guild: ${channel}\n\nMessage sent time (unix): ${(oldmsg.createdAt.getTime()/1000).toFixed(0)}\n\nMessage edit time (unix): ${(newmsg.editedAt.getTime()/1000).toFixed(0)}`
      var date = await getfulldate(true)
      writefile(".simplesniper/logs/msg_logs", `edit-${date}.txt`, message)
    }
  }
})

client.on("guildBanAdd", async (server, member) => {
  if (config.guild_ban_event.enabled_self == true && member.id == client.user.id) {
    if (config.guild_ban_event.notify == true) {
      log(`\x1b[95mGuild Ban Event: You have been banned from ${server.name} (${server.id})\x1b[0m`)
    }
    if (config.guild_ban_event.log == true) {
      var date = await getfulldate(true)
      await writefile(".simplesniper/logs/guild_logs", `selfban-${date}.txt`, `Banned from: ${server.name}, ${server.id}\n\nServer owner: ${server.owner.id}`)
    }
  }
  if (config.guild_ban_event.enabled_others == true && member.id != client.user.id) {
    if (config.guild_ban_event.notify == true) {
      log(`\x1b[95mGuild Ban Event: ${member.tag} (${member.id}) has been banned from ${server.name} (${server.id})\x1b[0m`)
    }
    if (config.guild_ban_event.log == true) {
      var date = await getfulldate(true)
      await writefile(".simplesniper/logs/guild_logs", `ban-${date}.txt`, `User: ${member.tag}, ${member.id}\n\nBanned from: ${server.name}, ${server.id}\n\nServer owner: ${server.owner.id}`)
    }
  }
})

client.on('guildDelete', async server => {
  if (config.guild_delete_event.enabled == true) {
    if (config.guild_delete_event.notify == true) {
      log(`\x1b[95mGuild Delete Event: ${server.name} (${server.id}) was removed from your server list\x1b[0m`)
    }
    if (config.guild_delete_event.log == true) {
      var date = await getfulldate(true)
      await writefile(".simplesniper/logs/guild_logs", `delete-${date}.txt`, `Deleted server: ${server.name}, ${server.id}\n\nServer owner: ${server.owner.id}`)
    }
  }
})

readtoken()