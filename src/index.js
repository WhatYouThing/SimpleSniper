import Discord from 'discord.js-selfbot-v13'
import { writeFile, readFile, appendFile, existsSync } from 'fs'
import readlinesync from 'readline-sync'
import http from 'snekfetch'

const util = {
  notify(content, rgb) {
    var color = util.getConsoleColor(rgb)
    var time = util.getFullDate()
    console.log(`\x1B[38;2;87;90;96m[${time}]\x1b[0m ${color}${content}\x1b[0m`)
  },
  async log(content) {
    var time = util.getFullDate()
    if (!existsSync(`${util.mainFolder}/log.txt`)) {
      await files.write(`${util.mainFolder}/log.txt`, `[${time}] ${content}`)
    }
    else {
      await files.append(`${util.mainFolder}/log.txt`, `\n[${time}] ${content}`)
    }
  },
  getFullDate(msgFrom, isEdited, americanDate) {
    if (msgFrom) {
      if (isEdited) {
        dateFrom = msgFrom.editedAt
      }
      else {
        dateFrom = msgFrom.createdAt
      }
    }
    else {
      var dateFrom = new Date
    }
    var dateValues = [
      dateFrom.getDate(),
      dateFrom.getMonth() + 1,
      dateFrom.getFullYear(),
      dateFrom.getHours(),
      dateFrom.getMinutes(),
      dateFrom.getSeconds()
    ]
    dateValues.map((value, index) => {
      if (String(value).length < 2) {
        dateValues[index] = `0${value}`
      }
    })
    if (americanDate) {
      return `${dateValues[1]}-${dateValues[0]}-${dateValues[2]} ${dateValues[3]}:${dateValues[4]}:${dateValues[5]}`
    }
    else {
      return `${dateValues[0]}-${dateValues[1]}-${dateValues[2]} ${dateValues[3]}:${dateValues[4]}:${dateValues[5]}`
    }
  },
  async readConfig() {
    var output = await files.read(`${util.mainFolder}/config.json`)
    return JSON.parse(String(output))
  },
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  doesInclude(checkedString, valuesTable, caseSensitive) {
    var result = false
    if (!checkedString || !valuesTable) {
      return false
    }
    valuesTable.map(item => {
      if (!caseSensitive) {
        if (checkedString.toLowerCase().includes(item.toLowerCase())) {
          result = true
          return
        }
      }
      else {
        if (checkedString.includes(item)) {
          result = true
          return
        }
      }
    })
    return result
  },
  getConsoleColor(rgb = [255, 255, 255]) {
    return `\x1B[38;2;${rgb[0]};${rgb[1]};${rgb[2]}m`
  },
  getHexColor(rgb) {
    var output = '#'
    rgb.map(color => {
      var hex = color.toString(16);
      var converted = hex.length == 1 ? "0" + hex : hex;
      output += converted
    })
    return output
  },
  logException(error, shouldNotify, shouldLog, rgb) {
    if (shouldNotify) {
      if (shouldLog) {
        util.notify(`Caught a exception, more details in the log.`, rgb)
      }
      else {
        util.notify(`Caught a exception.`, rgb)
      }
    }
    if (shouldLog) {
      util.log(`${error.stack}`)
    }
  },
  clearConsoleInput(clearedText) {
    var linecount = 0, lines = String(clearedText)
    if (lines.length == 0) {
      linecount = 1
    }
    while (lines.length > 0) {
      if (linecount >= 10000) {
        break
      }
      lines = lines.slice(process.stdout.columns)
      linecount += 1
    }
    process.stdout.moveCursor(0, -linecount)
    process.stdout.clearScreenDown()
  },
  async checkUpdate(currentVersion) {
    var githubPackage = await http.get("https://raw.githubusercontent.com/WhatYouThing/SimpleSniper/main/package.json")
    var githubVersion = JSON.parse(githubPackage.body)
    if (githubVersion.version != currentVersion) {
      util.notify("A new version of SimpleSniper is available on GitHub.", [119, 178, 85])
    }
  },
  getNotifyColors(json) {
    return [json.notify_r, json.notify_g, json.notify_b]
  },
  getInput(message, rgb) {
    util.notify(message, rgb)
    var input = readlinesync.question("")
    util.clearConsoleInput(input)
    return input
  },
  mainFolder: "SimpleSniper",
  defaultColor: [86, 98, 246]
}

const files = {
  write(path, content) {
    return new Promise(resolve => {
      writeFile(`${String(path)}`, String(content), (error) => {
        if (error) {
          resolve(undefined)
        }
        resolve(true)
      })
    })
  },
  append(path, content) {
    return new Promise(resolve => {
      appendFile(`${String(path)}`, String(content), (error) => {
        if (error) {
          resolve(undefined)
        }
        resolve(true)
      })
    })
  },
  read(path) {
    return new Promise(resolve => {
      readFile(`${String(path)}`, "utf8", function (err, data) {
        if (err) {
          resolve(false)
        }
        resolve(data)
      })
    })
  }
}

const discordutil = {
  getMsgAttachmentsList(msg) {
    var list = ''
    msg.attachments.map(async attachment => {
      if (list == '') {
        list += attachment.url
      }
      else {
        list += `, ${attachment.url}`
      }
    })
    return list
  },
  getMsgStickersList(msg) {
    var list = ''
    msg.stickers.map(async sticker => {
      if (list == '') {
        list += sticker.url
      }
      else {
        list += `, ${sticker.url}`
      }
    })
    return list
  },
  getMsgChannelInfo(msg, simpleOutput) {
    if (msg.channel.type == 'DM') {
      return "Direct Messages"
    }
    else {
      if (simpleOutput) {
        return `${msg.guild.name}, #${msg.channel.name}`
      }
      else {
        return `${msg.guild.name} (${msg.guild.id}), #${msg.channel.name} (${msg.channel.id})`
      }
    }
  },
  async webhookPost(webhook, embedtitle, embedrgb, emdedcontent) {
    return new Promise(async resolve => {
      var msgs = discordutil.splitMsg(emdedcontent)
      msgs.map(async message => {
        var embed = new Discord.MessageEmbed({ description: message, title: embedtitle, color: util.getHexColor(embedrgb) })
        http.post(webhook)
          .send({ embeds: [embed] })
          .then(a => resolve(true))
          .catch(async error => {
            util.notify(`A error occured while trying to post to one of your webhooks, logging the webhook's url.`, [255, 75, 75])
            await util.log(`Failed to post to webhook: ${webhook}`)
            resolve(false)
          })
      })
    })
  },
  splitMsg(msg) {
    var splitMsgArray = []
    var count = 2000
    for (var i = 0; msg.length > count; i++) {
      splitMsgArray.push(msg.slice(0, count))
      msg = msg.slice(count)
    }
    splitMsgArray.push(msg)
    return splitMsgArray
  }
}

var config

async function main() {
  config = await util.readConfig()

  if (!config) {
    util.notify("Unable to launch, could not read the config file.", [255, 75, 75])
    return
  }

  if (config.clear_cli_on_start) {
    process.stdout.moveCursor(0, -process.stdout.rows)
    process.stdout.clearScreenDown()
  }

  var localPackage = await files.read("package.json")
  var localVersion = JSON.parse(localPackage)

  util.notify(`SimpleSniper-${localVersion.version} initialized.`, util.defaultColor)

  await util.checkUpdate(localVersion.version)

  if (!config.crash_handler.force_disable) {
    process.on('unhandledRejection', error => {
      util.logException(error, config.crash_handler.notify, config.crash_handler.log, util.getNotifyColors(config.crash_handler))
    })
    process.on('uncaughtException', error => {
      util.logException(error, config.crash_handler.notify, config.crash_handler.log, util.getNotifyColors(config.crash_handler))
    })
  }
  else {
    util.notify(`Exception catching is disabled, the selfbot will likely crash if a error occurs.`, util.getNotifyColors(config.crash_handler))
  }

  var launcharg = process.argv.slice(2)

  if (launcharg != '') {
    util.notify("Found a launch argument, applying it as the token and starting.", util.defaultColor)
    auth(launcharg.toString())
    return
  }
  if (config.token_login.enabled) {
    auth(config.token_login.token)
  }
  else if (config.normal_login.enabled) {
    if (config.normal_login.has_two_factor) {
      var code = util.getInput("Eenter your 2FA code to proceed: ", util.defaultColor)
      auth(config.normal_login.email, config.normal_login.password, code)
    }
    else {
      auth(config.normal_login.email, config.normal_login.password)
    }
  }
  else {
    util.notify("Neither login options are enabled, please choose a option.", util.defaultColor)
    util.notify("0 - Quit", util.defaultColor)
    util.notify("1 - Log in with token", util.defaultColor)
    util.notify("2 - Log in with email and password", util.defaultColor)
    while (true) {
      var input = readlinesync.question("")
      util.clearConsoleInput(input)
      if (input == "1") {
        var token = util.getInput("Please input your token.", util.defaultColor)
        auth(token)
        break
      }
      if (input == "2") {
        var email = util.getInput("Please input your email.", util.defaultColor)
        var pass = util.getInput("Please input your password.", util.defaultColor)
        var twofactor = util.getInput("Please input your 2FA code (leave blank if no 2FA).", util.defaultColor)
        auth(email, pass, twofactor)
        break
      }
      if (input == "0") {
        process.exit(0)
      }
    }
  }
}
async function auth(tokenOrEmail, pass, twofactor) {
  process.stdin.resume()
  process.stdin.setEncoding("utf8")
  process.stdout.setEncoding("utf8")

  const client = new Discord.Client({ checkUpdate: false })

  if (!pass) {
    client.login(tokenOrEmail.trim())
  }
  else {
    if (twofactor) {
      client.normalLogin(tokenOrEmail.trim(), pass.trim(), twofactor.trim())
    }
    else {
      client.normalLogin(tokenOrEmail.trim(), pass.trim())
    }
  }

  async function command(input) {
    if (input.toLowerCase().startsWith("load")) {
      config = await util.readConfig()
      util.notify("Config loaded.", [119, 178, 85])
    }
    if (input.toLowerCase().startsWith("logout")) {
      util.notify(`Logging ${client.user.tag} out of SimpleSniper.`, util.defaultColor)
      client.removeAllListeners()
      client.destroy()
    }
    if (input.toLowerCase().startsWith("exit")) {
      process.exit(0)
    }
    if (input.toLowerCase().startsWith("clear")) {
      process.stdout.moveCursor(0, -process.stdout.rows)
      process.stdout.clearScreenDown()
    }
    if (input.toLowerCase().startsWith("help")) {
      util.notify(`Command List:\n> load - Reloads the config file without restarting the script.\n> logout - Logs out the currently used account without shutting down the script. Keep in mind that this likely will reset your account token.\n> exit - Ends the script's process without properly logging out of Discord (no token reset).`, util.defaultColor)
    }
  }

  process.stdin.on("data", async data => {
    util.clearConsoleInput(data)
    command(String(data).trim())
  })

  client.on("ready", async () => {
    util.notify(`Connected to Discord! Logged in as ${client.user.tag} (${client.user.id})`, util.defaultColor)
    if (config.activity.enabled) {
      client.user.setStatus(String(config.activity.type))
    }
    if (config.tokenlog_protection.enabled) {
      var allowedSessionList = [client.sessionId]
      util.notify(`Tokenlog Protection: Checking sessions every ${config.tokenlog_protection.check_interval}ms.`, [34, 102, 153])
      setInterval(async () => {
        const sessions = await http.get("https://discord.com/api/v9/auth/sessions", {
          headers: {
            "authorization": client.token,
            "x-super-properties": "ewogICJvcyI6ICJXaW5kb3dzIiwKICAiY2xpZW50X2J1aWxkX251bWJlciI6IDE1MjQ1MAp9"
          }
        })
        sessions.body.user_sessions.map(async session => {
          if (!allowedSessionList.includes(session.id_hash)) {
            var safetyPoints = 0
            var blockedDevices = 0
            if (util.doesInclude(session.client_info.location, config.tokenlog_protection.location_whitelist)) {
              safetyPoints += config.tokenlog_protection.location_points
            }
            if (util.doesInclude(session.client_info.platform, config.tokenlog_protection.client_whitelist)) {
              safetyPoints += config.tokenlog_protection.client_points
            }
            if (util.doesInclude(session.client_info.os, config.tokenlog_protection.os_whitelist)) {
              safetyPoints += config.tokenlog_protection.os_points
            }
            if (safetyPoints >= config.tokenlog_protection.min_points_to_allow) {
              util.notify(`Tokenlog Protection: Allowed a device with ${safetyPoints} point(s) [${session.client_info.os}; ${session.client_info.platform}; ${session.client_info.location}].`, [34, 102, 153])
              allowedSessionList.push(session.id_hash)
            }
            else {
              if (blockedDevices < config.tokenlog_protection.max_blocks_per_interval) {
                blockedDevices++
                await http.post("https://ptb.discord.com/api/v9/auth/sessions/logout", {
                  headers: {
                    "authorization": client.token,
                    "x-super-properties": "ewogICJvcyI6ICJXaW5kb3dzIiwKICAiY2xpZW50X2J1aWxkX251bWJlciI6IDE1MjQ1MAp9",
                    "content-type": "application/json"
                  },
                }).send({
                  password: config.tokenlog_protection.discord_password,
                  session_id_hashes: [session.id_hash]
                })
                util.notify(`Tokenlog Protection: Blocked a device with ${safetyPoints} point(s) [${session.client_info.os}; ${session.client_info.platform}; ${session.client_info.location}].`, [244, 144, 12])
              }
            }
          }
        })
      }, config.tokenlog_protection.check_interval);
    }
  })

  client.on("messageCreate", async msg => {
    if (config.control_server.enabled) {
      controlserver: {
        if (msg.channel.type == "GUILD_TEXT" && msg.content.startsWith(config.control_server.cs_prefix)) {
          if (!util.doesInclude(msg.guild.id, config.control_server.cs_id)) {
            break controlserver
          }
          if (config.control_server.enable_channel) {
            if (!util.doesInclude(msg.channel.id, config.control_server.cs_channel)) {
              break controlserver
            }
          }
          if (config.control_server.enable_manager) {
            if (!util.doesInclude(msg.author.id, config.control_server.cs_manager)) {
              break controlserver
            }
          }
          msg.content = msg.content.replace(config.control_server.cs_prefix, '').trim()
          command(msg.content)
        }
      }
    }
    msg_create: {
      if (config.msg_create_event.ignore_bots && msg.author.bot) {
        break msg_create
      }
      if (config.msg_create_event.enabled_server && msg.channel.type == "GUILD_TEXT" || config.msg_create_event.enabled_dm && msg.channel.type == 'DM') {
        if (config.msg_create_event.enable_filter) {
          var check = util.doesInclude(msg.content, config.msg_create_event.filter, config.msg_create_event.filter_case_sensitive)
          if (!config.msg_create_event.invert_filter && !check || config.msg_create_event.invert_filter && check) {
            return
          }
        }
        if (config.msg_create_event.enable_user_list) {
          var check = util.doesInclude(msg.author.id, config.msg_create_event.user_whitelist)
          if (!config.msg_create_event.invert_user_list && !check || config.msg_create_event.invert_user_list && check) {
            return
          }
        }
        if (config.msg_create_event.enable_channel_list) {
          var check = util.doesInclude(msg.channel.id, config.msg_create_event.channel_whitelist)
          if (!config.msg_create_event.invert_channel_list && !check || config.msg_create_event.invert_channel_list && check) {
            return
          }
        }
        if (config.msg_create_event.enable_guild_list) {
          var check = util.doesInclude(msg.guild.id, config.msg_create_event.guild_whitelist)
          if (!config.msg_create_event.invert_guild_list && !check || config.msg_create_event.invert_guild_list && check) {
            return
          }
        }
        if (config.msg_create_event.notify) {
          var simpleinfo = discordutil.getMsgChannelInfo(msg, true)
          util.notify(`Message Create: From ${msg.author.tag} in ${simpleinfo}: ${msg.content}`, util.getNotifyColors(config.msg_create_event))
        }
        if (config.msg_create_event.log || config.msg_create_event.webhook_notify_enable) {
          var attachments = discordutil.getMsgAttachmentsList(msg)
          var channelinfo = discordutil.getMsgChannelInfo(msg)
          var date = util.getFullDate(msg, false, config.american_dates)
          if (config.msg_create_event.log) {
            util.log(`Message Create\n> Author: ${msg.author.tag} (${msg.author.id})\n> Guild, Channel: ${channelinfo}\n> Sent date: ${date}\n> Attachments: [${attachments}]\n> Content: ${msg.content}`)
          }
          if (config.msg_create_event.webhook_notify_enable) {
            discordutil.webhookPost(config.msg_create_event.webhook_url, "Message Create", util.getNotifyColors(config.msg_create_event), `**Author**: ${msg.author.tag} (${msg.author.id})\n**Guild, Channel**: ${channelinfo}\n**Sent date**: ${date}\n**Attachments**: [${attachments}]\n**Content**: ${msg.content}`)
          }
        }
      }
    }
    giveawaySniper: {
      if (config.giveaway_sniper.enabled && msg.author.bot && msg.channel.type != "DM" && msg.components.length > 0) {
        var msgButton = msg.components.map(row => {
          return row.components.map(button => {
            if (button.type == "BUTTON") {
              return button
            }
          })
        })
        if (!msgButton || !msgButton.type == "BUTTON") {
          break giveawaySniper
        }
        if (!util.doesInclude(msg.content, config.giveaway_sniper.content_filters)) {
          break giveawaySniper
        }
        if (msg.embeds.length > 0) {
          var check = util.doesInclude(msg.embeds.pop().description.toString(), config.giveaway_sniper.embed_filters)
          if (!check) {
            break giveawaySniper
          }
        }
        if (!util.doesInclude(msg.author.id, config.giveaway_sniper.bot_id_whitelist)) {
          break giveawaySniper
        }
        if (!util.doesInclude(msg.channel.id, config.giveaway_sniper.channel_id_whitelist)) {
          break giveawaySniper
        }
        var timeout = util.randomNumber(config.giveaway_sniper.delay_min, config.giveaway_sniper.delay_max)
        if (config.giveaway_sniper.notify) {
          util.notify(`Giveaway Sniper: Entering giveaway in (${msg.guild.name}, #${msg.channel.name}) sent by ${msg.author.tag} (${timeout}ms delay)`, util.getNotifyColors(config.giveaway_sniper))
        }
        if (config.giveaway_sniper.log) {
          util.log(`Giveaway Sniper: Entering giveaway in (${msg.guild.name}, #${msg.channel.name}) sent by ${msg.author.tag} (${timeout}ms delay)`)
        }
        if (config.giveaway_sniper.webhook_notify_enable) {
          discordutil.webhookPost(config.giveaway_sniper.webhook_url, "Giveaway Sniper", util.getNotifyColors(config.giveaway_sniper), `Entering giveaway in (${msg.guild.name}, #${msg.channel.name}) sent by ${msg.author.tag} (${timeout}ms delay)\n\nLink to message: https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`)
        }
        setTimeout(async () => {
          await msg.clickButton()
        }, timeout);
      }
    }
  })

  client.on('messageDelete', async msg => {
    if (config.msg_delete_event.enabled && !msg.partial) {
      if (config.msg_delete_event.ignore_bots && msg.author.bot) {
        return
      }
      if (config.msg_delete_event.enable_filter) {
        var check = util.doesInclude(msg.content, config.msg_delete_event.filter, config.msg_delete_event.filter_case_sensitive)
        if (!config.msg_delete_event.invert_filter && !check || config.msg_delete_event.invert_filter && check) {
          return
        }
      }
      if (config.msg_delete_event.enable_user_list) {
        var check = util.doesInclude(msg.author.id, config.msg_delete_event.user_whitelist, false)
        if (!config.msg_delete_event.invert_user_list && !check || config.msg_delete_event.invert_user_list && check) {
          return
        }
      }
      if (config.msg_delete_event.enable_channel_list) {
        var check = util.doesInclude(msg.channel.id, config.msg_delete_event.channel_whitelist, false)
        if (!config.msg_delete_event.invert_channel_list && !check || config.msg_delete_event.invert_channel_list && check) {
          return
        }
      }
      if (config.msg_delete_event.enable_guild_list) {
        var check = util.doesInclude(msg.guild.id, config.msg_delete_event.guild_whitelist, false)
        if (!config.msg_delete_event.invert_guild_list && !check || config.msg_delete_event.invert_guild_list && check) {
          return
        }
      }
      if (config.msg_delete_event.notify) {
        var channelinfo = discordutil.getMsgChannelInfo(msg, true)
        util.notify(`Message Delete: From ${msg.author.tag} in ${channelinfo}: ${msg.content}`, util.getNotifyColors(config.msg_delete_event))
      }
      if (config.msg_delete_event.log || config.msg_delete_event.webhook_notify_enable) {
        var attachments = discordutil.getMsgAttachmentsList(msg)
        var channelinfo = discordutil.getMsgChannelInfo(msg)
        var date = util.getFullDate(msg, false, config.american_dates)
        if (config.msg_delete_event.log) {
          util.log(`Message Delete\n> Author: ${msg.author.tag} (${msg.author.id})\n> Guild, Channel: ${channelinfo}\n> Sent date: ${date}\n> Attachments: [${attachments}]\n> Content: ${msg.content}`)
        }
        if (config.msg_delete_event.webhook_notify_enable) {
          discordutil.webhookPost(config.msg_delete_event.webhook_url, "Message Delete", util.getNotifyColors(config.msg_delete_event), `**Author**: ${msg.author.tag} (${msg.author.id})\n**Guild, Channel**: ${channelinfo}\n**Sent date**: ${date}\n**Attachments**: [${attachments}]\n**Content**: ${msg.content}`)
        }
      }
    }
  })

  client.on("messageDeleteBulk", async msgs => {
    if (config.msg_purge_event.enabled) {
      msgs.map(async msg => {
        if (!msg.partial) {
          if (config.msg_purge_event.ignore_bots && msg.author.bot) {
            return
          }
          if (config.msg_purge_event.enable_filter) {
            var check = util.doesInclude(msg.content, config.msg_purge_event.filter, config.msg_purge_event.filter_case_sensitive)
            if (!config.msg_purge_event.invert_filter && !check || config.msg_purge_event.invert_filter && check) {
              return
            }
          }
          if (config.msg_purge_event.enable_user_list) {
            var check = util.doesInclude(msg.author.id, config.msg_purge_event.user_whitelist, false)
            if (!config.msg_purge_event.invert_user_list && !check || config.msg_purge_event.invert_user_list && check) {
              return
            }
          }
          if (config.msg_purge_event.enable_channel_list) {
            var check = util.doesInclude(msg.channel.id, config.msg_purge_event.channel_whitelist, false)
            if (!config.msg_purge_event.invert_channel_list && !check || config.msg_purge_event.invert_channel_list && check) {
              return
            }
          }
          if (config.msg_purge_event.enable_guild_list) {
            var check = util.doesInclude(msg.guild.id, config.msg_purge_event.guild_whitelist, false)
            if (!config.msg_purge_event.invert_guild_list && !check || config.msg_purge_event.invert_guild_list && check) {
              return
            }
          }
          if (config.msg_purge_event.notify) {
            var channelinfo = discordutil.getMsgChannelInfo(msg, true)
            util.notify(`Message Purge: From ${msg.author.tag} (${msg.author.id}) in ${channelinfo}: ${msg.content}`, util.getNotifyColors(config.msg_purge_event))
          }
          if (config.msg_purge_event.log || config.msg_purge_event.webhook_notify_enable) {
            var attachments = discordutil.getMsgAttachmentsList(msg)
            var channelinfo = discordutil.getMsgChannelInfo(msg)
            var date = util.getFullDate(msg, false, config.american_dates)
            if (config.msg_purge_event.log) {
              util.log(`Message Purge\n> Author: ${msg.author.tag} (${msg.author.id})\n> Guild, Channel: ${channelinfo}\n> Sent date: ${date}\n> Attachments: [${attachments}]\n> Content: ${msg.content}`)
            }
            if (config.msg_purge_event.webhook_notify_enable) {
              discordutil.webhookPost(config.msg_purge_event.webhook_url, "Message Purge", util.getNotifyColors(config.msg_purge_event), `**Author**: ${msg.author.tag} (${msg.author.id})\n**Guild, Channel**: ${channelinfo}\n**Sent date**: ${date}\n**Attachments**: [${attachments}]\n**Content**: ${msg.content}`)
            }
          }
        }
      })
    }
  })

  client.on("messageUpdate", async (oldmsg, newmsg) => {
    if (config.msg_edit_event.enabled && newmsg.editedAt && !oldmsg.partial && !newmsg.partial) {
      if (config.msg_edit_event.ignore_bots && newmsg.author.bot) {
        return
      }
      if (config.msg_edit_event.enable_filter) {
        var check = util.doesInclude(oldmsg.content, config.msg_edit_event.filter, config.msg_edit_event.filter_case_sensitive)
        if (!config.msg_edit_event.invert_filter && !check || config.msg_edit_event.invert_filter && check) {
          return
        }
      }
      if (config.msg_edit_event.enable_user_list) {
        var check = util.doesInclude(oldmsg.author.id, config.msg_edit_event.user_whitelist, false)
        if (!config.msg_edit_event.invert_user_list && !check || config.msg_edit_event.invert_user_list && check) {
          return
        }
      }
      if (config.msg_edit_event.enable_channel_list) {
        var check = util.doesInclude(oldmsg.channel.id, config.msg_edit_event.channel_whitelist, false)
        if (!config.msg_edit_event.invert_channel_list && !check || config.msg_edit_event.invert_channel_list && check) {
          return
        }
      }
      if (config.msg_edit_event.enable_guild_list) {
        var check = util.doesInclude(oldmsg.guild.id, config.msg_edit_event.guild_whitelist, false)
        if (!config.msg_edit_event.invert_guild_list && !check || config.msg_edit_event.invert_guild_list && check) {
          return
        }
      }
      if (config.msg_edit_event.notify) {
        var channelinfo = discordutil.getMsgChannelInfo(newmsg, true)
        util.notify(`Message Edit: From ${newmsg.author.tag} in ${channelinfo}: ${oldmsg.content}`, util.getNotifyColors(config.msg_edit_event))
      }
      if (config.msg_edit_event.log || config.msg_edit_event.webhook_notify_enable) {
        var attachmentsold = discordutil.getMsgAttachmentsList(oldmsg)
        var channelinfoold = discordutil.getMsgChannelInfo(oldmsg)
        var attachmentsnew = discordutil.getMsgAttachmentsList(newmsg)
        var date = util.getFullDate(oldmsg, false, config.american_dates)
        var editdate = util.getFullDate(newmsg, true, config.american_dates)
        if (config.msg_edit_event.log) {
          util.log(`Message Edit\n> Author: ${newmsg.author.tag} (${newmsg.author.id})\n> Guild, Channel: ${channelinfoold}\n> Sent date: ${date}\n> Edited date: ${editdate}\n> Old Attachments: [${attachmentsold}]\n> Old Content: ${oldmsg.content}\n> New Attachments: [${attachmentsnew}]\n> New Content: ${newmsg.content}`)
        }
        if (config.msg_edit_event.webhook_notify_enable) {
          discordutil.webhookPost(config.msg_edit_event.webhook_url, "Message Edit", util.getNotifyColors(config.msg_edit_event), `**Author**: ${newmsg.author.tag} (${newmsg.author.id})\n**Guild, Channel**: ${channelinfoold}\n**Sent date**: ${date}\n**Edited date**: ${editdate}\n**Old Attachments**: [${attachmentsold}]\n**Old Content**: ${oldmsg.content}\n**New Attachments**: [${attachmentsnew}]\n**New Content**: ${newmsg.content}\n**Link**: https://discord.com/channels/${newmsg.guild.id}/${newmsg.channel.id}/${newmsg.id}`)
        }
      }
    }
  })

  client.on("guildBanAdd", async ban => {
    if (config.guild_ban_event.enabled_self && !ban.partial && ban.user.id == client.user.id) {
      if (config.guild_ban_event.enable_guild_list) {
        var check = util.doesInclude(ban.guild.id, config.guild_ban_event.guild_whitelist, false)
        if (!config.guild_ban_event.invert_guild_list && !check || config.guild_ban_event.invert_guild_list && check) {
          return
        }
      }
      if (config.guild_ban_event.notify) {
        util.notify(`Self Guild Ban: You have been banned from ${ban.guild.name} (${ban.guild.id})`, util.getNotifyColors(config.guild_ban_event))
      }
      if (config.guild_ban_event.log) {
        util.log(`Self Guild Ban: You have been banned from ${ban.guild.name} (${ban.guild.id})`)
      }
      if (config.guild_ban_event.webhook_notify_enable) {
        discordutil.webhookPost(config.guild_ban_event.webhook_url, "Self Guild Ban", util.getNotifyColors(config.guild_ban_event), `You have been banned from ${ban.guild.name} (${ban.guild.id})`)
      }
    }
    if (config.guild_ban_event.enabled_others && !ban.partial && ban.user.id != client.user.id) {
      if (config.guild_ban_event.ignore_bots && ban.user.bot) {
        return
      }
      if (config.guild_ban_event.enable_user_list) {
        var check = util.doesInclude(ban.user.id, config.guild_ban_event.user_whitelist, false)
        if (!config.guild_ban_event.invert_user_list && !check || config.guild_ban_event.invert_user_list && check) {
          return
        }
      }
      if (config.guild_ban_event.enable_guild_list) {
        var check = util.doesInclude(ban.guild.id, config.guild_ban_event.guild_whitelist, false)
        if (!config.guild_ban_event.invert_guild_list && !check || config.guild_ban_event.invert_guild_list && check) {
          return
        }
      }
      if (config.guild_ban_event.notify) {
        util.notify(`Guild Ban: ${ban.user.tag} (${ban.user.id}) has been banned from ${ban.guild.name} (${ban.guild.id})`, util.getNotifyColors(config.guild_ban_event))
      }
      if (config.guild_ban_event.log) {
        util.log(`Guild Ban: ${ban.user.tag} (${ban.user.id}) has been banned from ${ban.guild.name} (${ban.guild.id})`)
      }
      if (config.guild_ban_event.webhook_notify_enable) {
        discordutil.webhookPost(config.guild_ban_event.webhook_url, "Guild Ban", util.getNotifyColors(config.guild_ban_event), `${ban.user.tag} (${ban.user.id}) has been banned from ${ban.guild.name} (${ban.guild.id})`)
      }
    }
  })

  client.on('guildDelete', async server => {
    if (config.guild_delete_event.enabled) {
      if (config.guild_delete_event.enable_guild_list) {
        var check = util.doesInclude(server.id, config.guild_delete_event.guild_whitelist, false)
        if (!config.guild_delete_event.invert_guild_list && !check || config.guild_delete_event.invert_guild_list && check) {
          return
        }
      }
      if (config.guild_delete_event.notify) {
        util.notify(`Guild Delete: ${server.name} (${server.id}) disappeared from your server list.`, util.getNotifyColors(config.guild_delete_event))
      }
      if (config.guild_delete_event.log) {
        util.log(`Guild Delete: ${server.name} (${server.id}) disappeared from your server list (kicked, or server got deleted/terminated).`)
      }
      if (config.guild_delete_event.webhook_notify_enable) {
        discordutil.webhookPost(config.guild_delete_event.webhook_url, "Guild Delete", util.getNotifyColors(config.guild_delete_event), `${server.name} (${server.id}) was removed from your server list (kicked, or server got deleted/terminated).`)
      }
    }
  })

  client.on('messageReactionAdd', async (reaction, user) => {
    if (config.legacy_giveaway_sniper.enabled && !reaction.partial && reaction.count <= 1 && reaction.message.channel.type == "GUILD_TEXT") {
      legacyGiveawaySniper: {
        if (config.legacy_giveaway_sniper.bot_check && !reaction.message.author.bot) {
          break legacyGiveawaySniper
        }
        if (config.legacy_giveaway_sniper.enable_filter) {
          var check = util.doesInclude(reaction.message.content, config.legacy_giveaway_sniper.filter, config.legacy_giveaway_sniper.filter_case_sensitive)
          if (!config.legacy_giveaway_sniper.invert_filter && !check || config.legacy_giveaway_sniper.invert_filter && check) {
            break legacyGiveawaySniper
          }
        }
        if (config.legacy_giveaway_sniper.enable_user_list) {
          var check = util.doesInclude(reaction.message.author.id, config.legacy_giveaway_sniper.user_whitelist, false)
          if (!config.legacy_giveaway_sniper.invert_user_list && !check || config.legacy_giveaway_sniper.invert_user_list && check) {
            break legacyGiveawaySniper
          }
        }
        if (config.legacy_giveaway_sniper.enable_channel_list) {
          var check = util.doesInclude(reaction.message.channel.id, config.legacy_giveaway_sniper.channel_whitelist, false)
          if (!config.legacy_giveaway_sniper.invert_channel_list && !check || config.legacy_giveaway_sniper.invert_channel_list && check) {
            break legacyGiveawaySniper
          }
        }
        var emoji = reaction.emoji
        if (config.legacy_giveaway_sniper.enable_emoji_list) {
          var check = util.doesInclude(emoji, config.legacy_giveaway_sniper.emoji_whitelist, false)
          if (!config.legacy_giveaway_sniper.invert_emoji_list && !check || config.legacy_giveaway_sniper.invert_emoji_list && check) {
            break legacyGiveawaySniper
          }
        }
        var timeout = util.randomNumber(config.legacy_giveaway_sniper.delay_min, config.legacy_giveaway_sniper.delay_max)
        if (config.legacy_giveaway_sniper.notify) {
          util.notify(`Legacy Giveaway Sniper: Entering giveaway in (${reaction.message.guild.name}, #${reaction.message.channel.name}) sent by ${reaction.message.author.tag} (${timeout}ms delay)`, util.getNotifyColors(config.legacy_giveaway_sniper))
        }
        if (config.legacy_giveaway_sniper.log) {
          util.log(`Legacy Giveaway Sniper: Entering giveaway in (${reaction.message.guild.name}, #${reaction.message.channel.name}) sent by ${reaction.message.author.tag} (${timeout}ms delay)`)
        }
        if (config.legacy_giveaway_sniper.webhook_notify_enable) {
          discordutil.webhookPost(config.legacy_giveaway_sniper.webhook_url, "Legacy Giveaway Sniper", util.getNotifyColors(config.legacy_giveaway_sniper), `Entering giveaway in (${reaction.message.guild.name}, #${reaction.message.channel.name}) sent by ${reaction.message.author.tag} (${timeout}ms delay)\n\nLink to message: https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`)
        }
        setTimeout(() => {
          reaction.message.react(emoji)
        }, timeout);
      }
    }
  })

  client.on("relationshipAdd", async (userid, type) => {
    if (config.friends_manager.enabled && type.toString() == "PENDING_INCOMING") {
      const user = await client.users.fetch(userid)
      if (config.friends_manager.log) {
        util.log(`Friends Manager: ${user.tag} (${user.id}) sent you a friend request.`)
      }
      if (config.friends_manager.notify) {
        util.notify(`Friends Manager: ${user.tag} (${user.id}) sent you a friend request.`, util.getNotifyColors(config.friends_manager))
      }
      if (config.friends_manager.webhook_notify_enable) {
        discordutil.webhookPost(config.friends_manager.webhook_url, "Friends Manager", util.getNotifyColors(config.friends_manager), `${user.tag} (${user.id}) sent you a friend request.`)
      }
    }
  })

  client.on("relationshipRemove", async userid => {
    if (config.friends_manager.enabled) {
      const user = await client.users.fetch(userid)
      if (config.friends_manager.log) {
        util.log(`Friends Manager: ${user.tag} (${user.id}) unfriended you, or cancelled their friend request.`)
      }
      if (config.friends_manager.notify) {
        util.notify(`Friends Manager: ${user.tag} (${user.id}) unfriended you, or cancelled their friend request.`, util.getNotifyColors(config.friends_manager))
      }
      if (config.friends_manager.webhook_notify_enable) {
        discordutil.webhookPost(config.friends_manager.webhook_url, "Friends Manager", util.getNotifyColors(config.friends_manager), `${user.tag} (${user.id}) unfriended you, or cancelled their friend request.`)
      }
    }
  })
}

main()