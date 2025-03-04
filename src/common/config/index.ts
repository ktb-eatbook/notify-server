import * as dotenv from "dotenv"

dotenv.config()

export const serverConfigs = {
    serverPort: process.env.SERVER_PORT,
    authEmailPass: process.env.GOOGLE_EMAIL_AUTH_PASS,
    authEmail: process.env.GOOGLE_AUTH_EMAIL,
    authUser: process.env.GOOGLE_AUTH_USER,
    host: process.env.GOOGLE_AUTH_HOST,
    discordWebhook: process.env.DISCORD_WEBHOOK,
    discordFoxIcon: process.env.DISCORD_FOX_ICON,
    bookKeeperUrl: process.env.BOOK_KEEPER_URL,
}

import * as fs from "fs"
import * as path from "path"

const whiteListPath = path.join(__dirname, "../../../../whitelist.txt")
const isExistsFile = fs.existsSync(whiteListPath)
let listDatas: string[]
if(isExistsFile) {
    listDatas = fs.readFileSync(whiteListPath, 'utf-8').split("\r\n")
} else {
    fs.writeFileSync(whiteListPath, '')
    listDatas = []
}


export const allowIps: string[] = listDatas