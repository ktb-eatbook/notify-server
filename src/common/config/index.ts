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
}

import * as fs from "fs"
import * as path from "path"

const whiteListPath = path.join(__dirname, "../../../../whitelist.txt")
const listDatas = fs.readFileSync(whiteListPath, 'utf-8').split("\r\n")

export const allowIps: string[] = listDatas