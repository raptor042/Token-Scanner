import { Telegraf, Markup } from "telegraf"
import { config } from "dotenv"
import { getTokenInfo } from "./__api__/index.js"
import { getAge, getLocaleStr } from "./controllers/index.js"

config()

const URL = process.env.TG_BOT_TOKEN

const bot = new Telegraf(URL)

bot.use(Telegraf.log())

bot.command("start", async ctx => {
    try {
        if (ctx.message.chat.type == "private") {
            await ctx.replyWithHTML(`<b>Hello ${ctx.message.from.username} 👋, Welcome to the most effective and efficient token scanner in the Avalanche(AVAX) Blockchain ✅.</b>\n\n<i>🔰 RevBot represents the pinnacle of precision in the token analytics realm. RevBot offers real-time token metrics in a consolidated delivery.</i>\n\n<b>Powered by the RevBot 🤖.</b>`)
        } else {
            await ctx.replyWithHTML(`<b>🚨 This bot is not allowed in groups.</b>`)
        }
    } catch (err) {
        await ctx.replyWithHTML("<b>🚨 An error occured while using the bot.</b>")
        console.log(err)
    }
})

bot.command("scan", async ctx => {
    try {
        if (ctx.message.chat.type == "private") {
            const args = ctx.args

            if(args && args.length == 1) {
                const tokenInfo = await getTokenInfo(args[0])
                const info = tokenInfo.data

                const mc = getLocaleStr((info.metrics.totalSupply * info.reprPair.price))
                const age = await getAge(info.creationBlock)

                await ctx.replyWithHTML(
                    `<b>💎 ${info.name} 💎</b>\n\n<b>📌 Contract Address:</b><i>${args[0]}</i>\n\n<b>🔱 Symbol:</b><i>${info.symbol}</i>\n\n<b>🪙 Token Analytics: ⬇️</b>\n<b>---------------------------</b>\n\n<b>📊 Market Cap:$</b><i>${mc}</i>\n\n<b>💲 Price:$</b><i>${info.reprPair.price}</i>\n\n<b>🕐 Age:</b><i>${age}</i>\n\n<b>🔐 Renounced:</b><i>${info.audit.is_contract_renounced ? "Yes ✅" : "No 🚫"}</i>\n\n<b>🛡 Contract Verified:</b><i>${info.audit.codeVerified ? "Yes ✅" : "No 🚫"}</i>`,
                    {
                        parse_mode : "HTML",
                        ...Markup.inlineKeyboard([
                            [Markup.button.url("Website", info.links.website == "" ? "https://t.me" : info.links.website)],
                            [Markup.button.url("Twitter", info.links.twitter == "" ? "https://t.me" : info.links.twitter)],
                            [Markup.button.url("Telegram", info.links.telegram == "" ? "https://t.me" : info.links.telegram)],
                            [Markup.button.url("Discord", info.links.discord == "" ? "https://t.me" : info.links.discord)]
                        ])
                    }
                )
            } else {
                await ctx.replyWithHTML("<b>🚨 Use the command appropriately.</b>\n\n<i>Example:\n/scan 'Token Address'</i>\n\n<b>🚫 Make sure you enter a correct address.</b>")
            }
        } else {
            await ctx.replyWithHTML(`<b>🚨 This bot is not allowed in groups.</b>`)
        }
    } catch (err) {
        await ctx.replyWithHTML("<b>🚨 An error occured while using the bot.</b>")
        console.log(err)
    }
})

bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))

process.once("SIGTERM", () => bot.stop("SIGTERM"))