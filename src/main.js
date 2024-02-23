const { app, BrowserWindow, ipcMain, shell } = require('electron')
const Discord = require("discord.js-selfbot-v13")
const http = require("snekfetch")
const path = require('path')
const os = require("os")
const fs = require("fs")

const util = {
  path(file) {
    if (!file) {
      return path.join(os.homedir(), `Documents/SimpleSniper`)
    }
    else {
      return path.join(os.homedir(), `Documents/SimpleSniper/${file}`)
    }
  }
}

const defaultConfig = {
  autoSignIn: {
    useToken: true,
    token: "",
    email: "",
    pass: "",
    twofactor: "",
  },
  misc: {
    dateFormat: 0,
    webhookUrl: "",
    defaultColor: "#5662f6"
  },
  autoStatus: {
    type: "invisible"
  },
  tokenLogProtex: {
    mode: 0,
    discordPass: "",
    locationList: [],
    clientList: [],
    osList: [],
    checkInterval: 10000,
    log: true,
    notify: true,
    webhookNotify: false,
    colorAllowed: "#226699",
    colorBlocked: "#f4900c"
  },
  errorHandler: {
    verbose: false,
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#ff4b4b"
  },
  friendTracker: {
    enabled: false,
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#f47fff"
  },
  msgCreate: {
    mode: 0,
    ignore: 0,
    filters: {
      content: {
        type: 0,
        list: []
      },
      user: {
        type: 0,
        list: []
      },
      channel: {
        type: 0,
        list: []
      },
      server: {
        type: 0,
        list: []
      }
    },
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#f47fff"
  },
  msgDelete: {
    mode: 0,
    ignore: 0,
    filters: {
      content: {
        type: 0,
        list: []
      },
      user: {
        type: 0,
        list: []
      },
      channel: {
        type: 0,
        list: []
      },
      server: {
        type: 0,
        list: []
      }
    },
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#f47fff"
  },
  msgPurge: {
    mode: 0,
    ignore: 0,
    filters: {
      content: {
        type: 0,
        list: []
      },
      user: {
        type: 0,
        list: []
      },
      channel: {
        type: 0,
        list: []
      },
      server: {
        type: 0,
        list: []
      }
    },
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#f47fff"
  },
  msgEdit: {
    mode: 0,
    ignore: 0,
    filters: {
      content: {
        type: 0,
        list: []
      },
      user: {
        type: 0,
        list: []
      },
      channel: {
        type: 0,
        list: []
      },
      server: {
        type: 0,
        list: []
      }
    },
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#f47fff"
  },
  serverBan: {
    mode: 0,
    filters: {
      user: {
        type: 0,
        list: []
      },
      server: {
        type: 0,
        list: []
      }
    },
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#f47fff"
  },
  guildDelete: {
    mode: 0,
    filters: {
      server: {
        type: 0,
        list: []
      }
    },
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#f47fff"
  },
  giveawaySniper: {
    mode: 0,
    type: 0,
    filters: {
      embed: {
        type: 0,
        list: []
      },
      reaction: {
        type: 0,
        list: []
      },
      bot: {
        type: 0,
        list: []
      },
      channel: {
        type: 0,
        list: []
      },
      server: {
        type: 0,
        list: []
      }
    },
    delay: {
      min: 30000,
      max: 300000
    },
    log: true,
    notify: true,
    webhookNotify: false,
    color: "#f47fff"
  },
}

var folders = ["", "Configs", "Media Stealer"]
var files = [
  {
    name: "Log.txt",
    content: ""
  },
  {
    name: "Data.json",
    content: JSON.stringify({
      defaultConfig: "default",
      hardwareAccel: false
    }, null, 4)
  },
  {
    name: "Configs/default.json",
    content: JSON.stringify(defaultConfig, null, 4)
  }
]

folders.map(value => {
  const path = util.path(value)
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
})

files.map(value => {
  const path = util.path(value.name)
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, value.content)
  }
})

const client = new Discord.Client({ checkUpdate: false })
const dataFile = JSON.parse(fs.readFileSync(util.path("Data.json")).toString())
var configFile = JSON.parse(fs.readFileSync(util.path(`Configs/${dataFile.defaultConfig}.json`)).toString())

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile('src/index.html')

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  const util = {
    notify(console = true, log = true, webhook = true, title = "", color = "", message = "", fields = [{ name: "", text: "", links: [] }]) {
      if (console) {
        mainWindow.webContents.send("logToConsole", { title, color, message, fields })
      }
      if (log) {
        fs.appendFileSync(util.path("Log.txt"), text)
      }
    },
    log(text = "") {
      
    },
    webhook(text = "") {
      http.post(configFile.misc.webhookUrl)
    }
  }

  ipcMain.handle("loginToken", async (event, data) => {
    try {
      await client.login(data.token)
      return { success: true, user: client.user.tag }
    }
    catch (error) {
      return { success: false, error: error }
    }
  })

  ipcMain.handle("loginNormal", async (event, data) => {
    if (data.code) {
      try {
        await client.normalLogin(data.email, data.pass, data.code)
        return { success: true, user: client.user.tag }
      }
      catch (error) {
        return { success: false, error: error }
      }
    }
    else {
      try {
        await client.normalLogin(data.email, data.pass)
        return { success: true, user: client.user.tag }
      }
      catch (error) {
        return { success: false, error: error }
      }
    }
  })

  ipcMain.handle("logToFile", async (event, data) => {
    var filePath = util.path("Log.txt")
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "")
    }
    fs.appendFileSync(filePath, data)
    return
  })

  ipcMain.handle("getConfigList", (event, data) => {
    var configs = fs.readdirSync(util.path("Configs"))
    return configs.map(cfg => cfg.slice(0, cfg.length - 5))
  })

  client.on("ready", () => {

  })

  client.on("relationshipAdd", async (id, type) => {
    if (configFile.friendTracker.enabled) {
      if (type == "PENDING_INCOMING") {
        const user = await client.users.fetch(id)
        if (configFile.friendTracker.notify) {
          notify.console("Friend Tracker", configFile.friendTracker.color, "", [
            { name: "Type", text: "Incoming Friend Request" },
            { name: "From", text: `${user.tag} (${user.id})` }
          ])
        }
      }
      if (type == "FRIEND") {
        const user = await client.users.fetch(id)
        if (configFile.friendTracker.notify) {
          notify.console("Friend Tracker", configFile.friendTracker.color, "", [
            { name: "Type", text: "Friend Request Accepted" },
            { name: "From", text: `${user.tag} (${user.id})` }
          ])
        }
      }
    }
  })

  client.on("relationshipRemove", async id => {
    if (configFile.friendTracker.enabled) {
      const user = await client.users.fetch(id)
      if (configFile.friendTracker.notify) {
        notify.console("Friend Tracker", configFile.friendTracker.color, "", [
          { name: "Type", text: "Removed As Friend" },
          { name: "From", text: `${user.tag} (${user.id})` }
        ])
      }
    }
  })

  client.on("messageCreate", async msg => {

  })
}


if (!dataFile.hardwareAccel) {
  app.disableHardwareAcceleration()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})