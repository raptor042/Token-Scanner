import { Telegraf, Markup } from "telegraf"
import { config } from "dotenv"
import { getTokenInfoI, getTokenInfoII } from "./__api__/index.js"
import { getSupply } from "./__web3__/index.js"
import { getAge, getLocaleStr } from "./__utils__/index.js"

config()

const URL = process.env.TG_BOT_TOKEN

const bot = new Telegraf(URL)

bot.use(Telegraf.log())

bot.command("start", async ctx => {
    try {
        await ctx.replyWithHTML(`<b>Hello ${ctx.message.from.username} 👋, Welcome to the most effective and efficient token scanner in the Avalanche(AVAX) Blockchain ✅.</b>\n\n<i>🔰 RevBot represents the pinnacle of precision in the token analytics realm. RevBot offers real-time token metrics in a consolidated delivery.</i>\n\n<b>Powered by the RevBot 🤖.</b>`)
    } catch (err) {
        await ctx.replyWithHTML("<b>🚨 An error occured while using the bot.</b>")
        console.log(err)
    }
})

bot.hears(/^0x/, async ctx => {
    try {
        const address = ctx.message.text
        console.log(address)

        if(address.length == 42) {
            const info = await getTokenInfoI(address)
            const _info = await getTokenInfoII(info.pairAddress)

            const mc = getLocaleStr(_info.pair.fdv)
            const age = await getAge(_info.pair.pairCreatedAt)

            await ctx.replyWithHTML(
                `<b>💎 ${info.token.name} | ETH 💎</b>\n\n<b>📌 Contract Address:</b><span class='tg-spoiler'>${info.token.address}</span>\n\n<b>🔱 Symbol:</b><span class='tg-spoiler'>$${info.token.symbol}</span>\n\n<b>🪙 Token Analytics: ⬇️</b>\n<b>---------------------------</b>\n\n<b>📊 Market Cap:$</b><span class='tg-spoiler'>${mc}</span>\n\n<b>💲 Price:</b><span class='tg-spoiler'>$${_info.pair.priceUsd} | ${_info.pair.priceNative} ${_info.pair.quoteToken.symbol}</span>\n\n<b>📈 PriceChange:</b><span class='tg-spoiler'>5M: ${_info.pair.priceChange.m5} | 1Hr: ${_info.pair.priceChange.h1} | 6Hr: ${_info.pair.priceChange.h6} | 24Hr: ${_info.pair.priceChange.h24}</span>\n\n<b>💰 Liquidity:</b><span class='tg-spoiler'>$${getLocaleStr(_info.pair.liquidity.usd)} | ${getLocaleStr(_info.pair.liquidity.base)} ${_info.pair.baseToken.symbol} | ${getLocaleStr(_info.pair.liquidity.quote)} ${_info.pair.quoteToken.symbol}</span>\n\n<b>🍯 Honeypot:</b><span class='tg-spoiler'>${info.honeypotResult.isHoneypot ? "Yes 🚫" : "No ✅"}</span>\n\n<b>💵 Tax:</b><span class='tg-spoiler'>${Number(info.simulationResult.buyTax).toFixed(2)}% Buy | ${Number(info.simulationResult.sellTax).toFixed(2)}% Sell</span>\n\n<b>🕐 Age:</b><span class='tg-spoiler'>${age}</span>\n\n<b>🛡 Contract Verified:</b><span class='tg-spoiler'>${info.contractCode.openSource ? "Yes ✅" : "No 🚫"}</span>`,
                {
                    parse_mode : "HTML",
                    ...Markup.inlineKeyboard([
                        [Markup.button.url("Website", _info.pair.info.websites.length > 0 ? _info.pair.info.websites[0].url : "https://t.me")],
                        [Markup.button.url("Twitter", _info.pair.info.socials.length > 0 ? _info.pair.info.socials[0].url : "https://t.me")],
                        [Markup.button.url("Telegram", _info.pair.info.socials.length > 1 ? _info.pair.info.socials[1].url : "https://t.me")],
                        [Markup.button.url("Discord", _info.pair.info.socials.length > 2 ? _info.pair.info.socials[2].url : "https://t.me")],
                        [Markup.button.url("Chart", _info.pair.url)]
                    ])
                }
            )
        } else {
            await ctx.replyWithHTML("<b>⛔️ Invalid Contract Address.</b>")
        }
    } catch (err) {
        await ctx.replyWithHTML("<b>🚨 An error occured while using the bot. Make sure you input the correct token CA on Ethereum.</b>")
        console.log(err)
    }
})

bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))

process.once("SIGTERM", () => bot.stop("SIGTERM"))