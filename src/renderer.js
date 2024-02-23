const { ipcRenderer } = require('electron')

const util = {
    gebid(id) {
        return document.getElementById(id)
    },
    displayDiv(toShow, toHide) {
        gebid(toHide).style.display = "none"
        gebid(toShow).style.display = "flex"
    },
    createElement(tagName, styles) {
        var element = document.createElement(tagName)
        if (styles) {
            for (var [name, value] of Object.entries(styles)) {
                element.style[name] = value
            }
        }
        return element
    },
    async logToConsole(title = "", color = "", message = "", fields = [{ name: "", text: "", links: [] }]) {
        var divList = []
        var notifDiv = util.createElement("div", {
            backgroundColor: "#181818",
            display: "flex",
            flexDirection: "column",
            paddingRight: "6px",
            marginBottom: "15px",
            marginTop: "15px",
            marginLeft: "10px",
            marginRight: "10px",
            width: "fit-content",
            maxWidth: "100%",
            color: "#d7d7d7",
            position: "relative"
        })

        var barDiv = util.createElement("div", {
            backgroundColor: color,
            width: "4px",
            height: "100%",
            position: "absolute",
            left: "0"
        })

        var titleDiv = util.createElement("div", {
            fontSize: "14px",
            marginTop: "6px",
            marginLeft: "10px",
            marginBottom: "6px"
        })

        var titleSpan = util.createElement("span", {
            wordBreak: "break-all"
        })
        var titleText = util.createElement("strong")
        titleText.textContent = title
        titleSpan.insertAdjacentElement("beforeend", titleText)
        titleDiv.insertAdjacentElement("beforeend", titleSpan)
        divList.push(titleDiv)


        fields.map(field => {
            if (!field.name) {
                return
            }
            if (field.links) {
                var lineDiv = util.createElement("div", {
                    fontSize: "12px",
                    marginLeft: "10px",
                    marginBottom: "1px",
                    marginTop: "1px"
                })
                var labelSpan = util.createElement("span", {
                    wordBreak: "break-all"
                })
                var labelText = util.createElement("strong")
                labelText.textContent = `${field.name}: `
                labelSpan.insertAdjacentElement("beforeend", labelText)
                field.links.map((link, index) => {
                    var labelP = util.createElement("a", {
                        color: "#73c991",
                        textDecoration: "none"
                    })
                    labelP.textContent = link.split("/").pop().split("?").shift()
                    labelP.href = link
                    labelP.target = "_blank"
                    labelP.rel = "noopener noreferrer"
                    labelSpan.insertAdjacentElement("beforeend", labelP)
                    if (index + 1 < field.links.length) {
                        var seperator = util.createElement("a")
                        seperator.textContent = ", "
                        labelSpan.insertAdjacentElement("beforeend", seperator)
                    }
                })
                lineDiv.insertAdjacentElement("afterbegin", labelSpan)
                divList.push(lineDiv)
            }
            else {
                var lineDiv = util.createElement("div", {
                    fontSize: "12px",
                    marginLeft: "10px",
                    marginBottom: "1px",
                    marginTop: "1px"
                })
                var labelSpan = util.createElement("span", {
                    wordBreak: "break-all"
                })
                labelSpan.textContent = field.text
                var labelText = util.createElement("strong")
                labelText.textContent = `${field.name}: `
                labelSpan.insertAdjacentElement("afterbegin", labelText)
                lineDiv.insertAdjacentElement("afterbegin", labelSpan)
                divList.push(lineDiv)
            }
        })

        if (message) {
            var contentDiv = util.createElement("div", {
                fontSize: "12px",
                marginLeft: "10px",
                marginBottom: "4px",
                marginTop: "4px"
            })
            var contentSpan = util.createElement("span", {
                wordBreak: "break-all"
            })
            contentSpan.textContent = message
            contentDiv.insertAdjacentElement("beforeend", contentSpan)
            divList.push(contentDiv)
        }

        var timeDiv = util.createElement("div", {
            fontSize: "10px",
            marginLeft: "10px",
            marginBottom: "6px",
            marginTop: "6px",
            color: "#6e7681"
        })

        var timeSpan = util.createElement("span", {
            wordBreak: "break-all"
        })
        timeSpan.textContent = await ipcRenderer.invoke("getFullDate")
        timeDiv.insertAdjacentElement("beforeend", timeSpan)
        divList.push(timeDiv)

        divList.map((div) => {
            notifDiv.insertAdjacentElement("beforeend", div)
        })

        notifDiv.appendChild(barDiv)

        var console = document.getElementById("mainMenuConsoleWindow")

        if (console.scrollHeight - console.scrollTop == console.clientHeight) {
            console.insertAdjacentElement("beforeend", notifDiv)
            console.scrollTop = console.scrollHeight
        }
        else {
            console.insertAdjacentElement("beforeend", notifDiv)
        }
    },
    logToFile(content) {
        ipcRenderer.invoke("logToFile", content)
    },
    buttonToBool(id) {
        return this.gebid(id).classList.contains("checked")
    },
    addToSelect(id, table) {
        var select = this.gebid(id)
        select.querySelectorAll("option").forEach(option => [
            option.remove()
        ])
        table.map(option => {
            var element = document.createElement('option');
            element.value = option
            if (option.length > 50) {
                element.innerHTML = `${option.slice(0, 20)}...`
            }
            else {
                element.innerHTML = option
            }
            select.appendChild(element)
        })
    },
    async login() {
        const token = util.gebid("loginInputToken").value.trim()
        const email = util.gebid("loginInputEmail").value.trim()
        const pass = util.gebid("loginInputPass").value.trim()
        const twofactor = util.gebid("loginInput2FA").value
        if (token) {
            util.gebid("loginOut").textContent = `Logging in...`
            const result = await ipcRenderer.invoke("loginToken", { token: token })
            if (!result.success) {
                util.gebid("loginOut").textContent = result.error
            }
            else {
                util.gebid("loginOut").textContent = `Successfully logged in as ${result.user}.`
            }
        }
        else if (email && pass) {
            util.gebid("loginOut").textContent = `Logging in...`
            const result = await ipcRenderer.invoke("loginNormal", { email: email, pass: pass, code: twofactor })
            if (!result.success) {
                util.gebid("loginOut").textContent = result.error
            }
            else {
                util.gebid("loginOut").textContent = `Successfully logged in as ${result.user}.`
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    var configs = await ipcRenderer.invoke("getConfigList", null)
    util.addToSelect("configList", configs)
})

ipcRenderer.on("logToConsole", (event, data) => {
    util.logToConsole(data.title, data.color, data.message, data.fields)
})

const commands = [
    {
        name: "test",
        func() {
            util.logToConsole("this is a test", "#9f2525", "hello", [
                {
                    name: "files",
                    links: [
                        "https://cdn.discordapp.com/emojis/940261256500224040.gif?size=96&quality=lossless",
                        "https://cdn.discordapp.com/attachments/814614949116379208/1132421097594302545/150519104533-01-china-nail-house-0519-restricted.png"
                    ]
                },
                {
                    name: "test",
                    text: "yo yo yo"
                }
            ])
        }
    }
]

util.gebid("loginTypeToken").addEventListener('click', () => {
    util.gebid("loginScreenEmail").style.display = "none"
    util.gebid("loginScreenToken").style.display = "flex"
    util.gebid("loginInputEmail").value = ""
    util.gebid("loginInputPass").value = ""
    util.gebid("loginInput2FA").value = ""
})

util.gebid("loginTypeEmail").addEventListener('click', () => {
    util.gebid("loginScreenToken").style.display = "none"
    util.gebid("loginScreenEmail").style.display = "flex"
    util.gebid("loginInputToken").value = ""
})

util.gebid("loginButton").addEventListener("click", async () => {
    await util.login()
})

for (var id of ["loginInputEmail", "loginInputPass", "loginInputToken"]) {
    util.gebid(id).addEventListener("keydown", async (key) => {
        if (key.code.toLowerCase() == "enter") {
            await util.login()
        }
    })
}

util.gebid("mainMenuConsoleInput").addEventListener("keyup", key => {
    if (key.code.toLowerCase() == "enter") {
        var input = util.gebid("mainMenuConsoleInput").value
        commands.map(cmd => {
            if (input.toLowerCase().trim() == cmd.name) {
                cmd.func()
            }
        })
        util.gebid("mainMenuConsoleInput").value = ""
    }
})

util.gebid("configReloadList").addEventListener("click", async () => {
    var configs = await ipcRenderer.invoke("getConfigList", null)
    util.addToSelect("configList", configs)
})

util.gebid("configLoad").addEventListener("click", async () => {
    await ipcRenderer.invoke("loadConfigFile", util.gebid("configList").value)
})