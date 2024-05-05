import { Telegraf, Markup } from "telegraf"
import { config } from "dotenv"
import { getCACreation, getTokenInfoI, getTokenInfoII } from "./__api__/index.js"
import { balanceOf, getBalance, getBlock, getLogs, getSupply } from "./__web3__/index.js"
import { format, getAge, getLocaleStr } from "./__utils__/index.js"

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

            const ca = await getCACreation(address)
            const balance = await getBalance(ca.result[0].contractCreator)

            const supply = await getSupply(address, info.token.decimals)
            const balanceCA = await balanceOf(address, info.token.decimals)
            const clog = (balanceCA / supply) * 100
            console.log(clog)

            const mc = getLocaleStr(_info.pair.fdv)
            const age = await getAge(_info.pair.pairCreatedAt)
            const block = await getBlock(info.pair.creationTxHash)
            const logs = await getLogs(address, block)

            let sniper_text = ""
            let total_sniped_volume = 0

            if(logs.length <= 10) {
                logs.forEach((log, index) => {
                    if(index == 0) {
                        sniper_text += `🥇 <span class='tg-spoiler'>${log.args[1]}</span> | <span class='tg-spoiler'>${getLocaleStr(format(info.token.decimals, log.args[2], "div"))} ${info.token.symbol}</span>\n\n`
                        total_sniped_volume += format(info.token.decimals, log.args[2], "div")
                    } else if(index == 1) {
                        sniper_text += `🥈 <span class='tg-spoiler'>${log.args[1]}</span> | <span class='tg-spoiler'>${getLocaleStr(format(info.token.decimals, log.args[2], "div"))} ${info.token.symbol}</span>\n\n`
                        total_sniped_volume += format(info.token.decimals, log.args[2], "div")
                    } else if(index == 2) {
                        sniper_text += `🥉 <span class='tg-spoiler'>${log.args[1]}</span> | <span class='tg-spoiler'>${getLocaleStr(format(info.token.decimals, log.args[2], "div"))} ${info.token.symbol}</span>\n\n`
                        total_sniped_volume += format(info.token.decimals, log.args[2], "div")
                    } else {
                        sniper_text += `🏅 <span class='tg-spoiler'>${log.args[1]}</span> | <span class='tg-spoiler'>${getLocaleStr(format(info.token.decimals, log.args[2], "div"))} ${info.token.symbol}</span>\n\n`
                        total_sniped_volume += format(info.token.decimals, log.args[2], "div")
                    }
                })
            } else {
                const _logs = logs.slice(0, 10)

                _logs.forEach((log, index) => {
                    if(index == 0) {
                        sniper_text += `🥇 <span class='tg-spoiler'>${log.args[1]}</span> | <span class='tg-spoiler'>${getLocaleStr(format(info.token.decimals, log.args[2], "div"))} ${info.token.symbol}</span>\n\n`
                        total_sniped_volume += format(info.token.decimals, log.args[2], "div")
                    } else if(index == 1) {
                        sniper_text += `🥈 <span class='tg-spoiler'>${log.args[1]}</span> | <span class='tg-spoiler'>${getLocaleStr(format(info.token.decimals, log.args[2], "div"))} ${info.token.symbol}</span>\n\n`
                        total_sniped_volume += format(info.token.decimals, log.args[2], "div")
                    } else if(index == 2) {
                        sniper_text += `🥉 <span class='tg-spoiler'>${log.args[1]}</span> | <span class='tg-spoiler'>${getLocaleStr(format(info.token.decimals, log.args[2], "div"))} ${info.token.symbol}</span>\n\n`
                        total_sniped_volume += format(info.token.decimals, log.args[2], "div")
                    } else {
                        sniper_text += `🏅 <span class='tg-spoiler'>${log.args[1]}</span> | <span class='tg-spoiler'>${getLocaleStr(format(info.token.decimals, log.args[2], "div"))} ${info.token.symbol}</span>\n\n`
                        total_sniped_volume += format(info.token.decimals, log.args[2], "div")
                    }
                })
            }

            await ctx.replyWithHTML(
                `<b>💎 ${info.token.name} | ETH 💎</b>\n\n<b>📌 Contract Address:</b><span class='tg-spoiler'>${info.token.address}</span>\n\n<b>🔱 Symbol:</b><span class='tg-spoiler'>$${info.token.symbol}</span>\n\n\n<b>🪙 Token Analytics: ⬇️</b>\n<b>---------------------------</b>\n\n<b>📊 Market Cap:$</b><span class='tg-spoiler'>${mc}</span>\n\n<b>💲 Price:</b><span class='tg-spoiler'>$${_info.pair.priceUsd} | ${_info.pair.priceNative} ${_info.pair.quoteToken.symbol}</span>\n\n<b>📈 PriceChange:</b><span class='tg-spoiler'>5M: ${_info.pair.priceChange.m5} | 1Hr: ${_info.pair.priceChange.h1} | 6Hr: ${_info.pair.priceChange.h6} | 24Hr: ${_info.pair.priceChange.h24}</span>\n\n<b>💸 Volume:</b><span class='tg-spoiler'>5M: ${getLocaleStr(_info.pair.volume.m5)} | 1Hr: ${getLocaleStr(_info.pair.volume.h1)} | 6Hr: ${getLocaleStr(_info.pair.volume.h6)} | 24Hr: ${getLocaleStr(_info.pair.volume.h24)}</span>\n\n<b>♻️ Buys/Sells:</b><span class='tg-spoiler'>5M: ${_info.pair.txns.m5.buys}/${_info.pair.txns.m5.sells} | 1Hr ${_info.pair.txns.h1.buys}/${_info.pair.txns.h1.sells} | 6Hr ${_info.pair.txns.h6.buys}/${_info.pair.txns.h6.sells} | | 24Hr ${_info.pair.txns.h24.buys}/${_info.pair.txns.h24.sells}</span>\n\n<b>💰 Liquidity:</b><span class='tg-spoiler'>$${getLocaleStr(_info.pair.liquidity.usd)} | ${getLocaleStr(_info.pair.liquidity.base)} ${_info.pair.baseToken.symbol} | ${getLocaleStr(_info.pair.liquidity.quote)} ${_info.pair.quoteToken.symbol}</span>\n\n<b>🍯 Honeypot:</b><span class='tg-spoiler'>${info.honeypotResult.isHoneypot ? "Yes 🚫" : "No ✅"}</span>\n\n<b>🏦 Tax:</b><span class='tg-spoiler'>${Number(info.simulationResult.buyTax).toFixed(2)}% Buy | ${Number(info.simulationResult.sellTax).toFixed(2)}% Sell</span>\n\n<b>🕐 Age:</b><span class='tg-spoiler'>${age}</span>\n\n<b>🛡 Contract Verified:</b><span class='tg-spoiler'>${info.contractCode.openSource ? "Yes ✅" : "No 🚫"}</span>\n\n\n<b>👝 Wallet Insights: ⬇️</b>\n<b>---------------------------</b>\n\n<b>👝 Deployer Wallet:</b><span class='tg-spoiler'>${ca.result[0].contractCreator}</span>\n\n<b>💵 Deployer Balance:</b><span class='tg-spoiler'>${Number(balance).toFixed(3)} ETH</span>\n\n<b>🪠 Clog(% of tokens in the contract):</b><span class='tg-spoiler'>${Number(clog).toFixed(2)}%</span>\n\n\n<b>🚀 Sniper Data: ⬇️</b>\n<b>---------------------------</b>\n\n<b>🔫 ${logs.length} person(s) sniped in the first block.</b>\n\n${sniper_text}<b>💸 Total Sniper Volume:</b><span class='tg-spoiler'>${getLocaleStr(total_sniped_volume)} ${info.token.symbol}</span>\n\n\n<i>Always DYOR. Scanners are not always 100% accurate.</i>`,
                {
                    parse_mode : "HTML",
                    ...Markup.inlineKeyboard([
                        [Markup.button.url("Website", "info" in _info.pair && "websites" in _info.pair.info && _info.pair.info.websites.length > 0 ? _info.pair.info.websites[0].url : "https://t.me")],
                        [Markup.button.url("Twitter", "info" in _info.pair && "socials" in _info.pair.info && _info.pair.info.socials.length > 0 ? _info.pair.info.socials[0].url : "https://t.me")],
                        [Markup.button.url("Telegram", "info" in _info.pair && "socials" in _info.pair.info && _info.pair.info.socials.length > 1 ? _info.pair.info.socials[1].url : "https://t.me")],
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