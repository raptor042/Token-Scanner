import { Telegraf, Markup } from "telegraf"
import { config } from "dotenv"
import { getCaABI, getCaCreation, getTokenInfoI, getTokenInfoII } from "./__api__/index.js"
import { balanceOf, getBalance, getBlock, getChain, getLogs, getOwner, getSupply } from "./__web3__/index.js"
import { format, getAge, getLocaleStr } from "./__utils__/index.js"
import { ethers } from "ethers"

config()

const URL = process.env.TG_BOT_TOKEN

const bot = new Telegraf(URL)

bot.use(Telegraf.log())

bot.command("start", async ctx => {
    try {
        await ctx.replyWithHTML(`<b>Hello ${ctx.message.from.username} 👋, Welcome to the most effective and efficient token scanner on ETH and Base ✅.</b>\n\n<i>🔰 RevBot represents the pinnacle of precision in the token analytics realm. RevBot offers real-time token metrics in a consolidated delivery.</i>\n\n<b>Powered by the AlphaDevBot 🤖.</b>`)
    } catch (error) {
        await ctx.replyWithHTML("<b>🚨 An error occured while using the bot.</b>")
        console.log(error)
    }
})

bot.hears(/^0x/, async ctx => {
    try {
        const address = ctx.message.text
        console.log(address)

        if(address.length == 42) {
            const chain = await getChain(address)
            let _chain

            if(chain == "ethereum") {
                _chain = "ETH"
            } else if(chain == "base") {
                _chain = "BASE"
            }

            const info = await getTokenInfoI(address)
            const _info = await getTokenInfoII(info.pairAddress, chain)

            const ABI = await getCaABI(address, chain)
            const abi = JSON.parse(ABI)
            console.log(abi)

            const owner = await getOwner(address, abi, chain)

            const ca = await getCaCreation(address, chain)

            const supply = await getSupply(address, info.token.decimals, chain)
            const balanceCA = await balanceOf(address, info.token.decimals, chain)
            const clog = (balanceCA / supply) * 100
            console.log(clog)

            const balance = await balanceOf(ca.result[0].contractCreator, info.token.decimals, chain)

            let whitelist = false
            let blacklist = false
            let taxMod = false
            let mintable = false
            let pausable = false
            let cooldown = false
            let isAntiWhale = false
            let issues = 0

            abi.forEach(func => {
                if(`${func.name}`.includes("whitelist")) {
                    whitelist = true
                } else if(`${func.name}`.includes("blacklist")){
                    blacklist = true
                } else if(`${func.name}`.includes("taxUpdate")){
                    taxMod = true
                } else if(`${func.name}`.includes("mintable")){
                    mintable = true
                } else if(`${func.name}`.includes("pausable")){
                    pausable = true
                } else if(`${func.name}`.includes("cooldown")){
                    cooldown = true
                } else if(`${func.name}`.includes("maxTx")){
                    isAntiWhale = true
                }
            })

            if(info.honeypotResult.isHoneypot) {
                issues++
            }
            if(info.simulationResult.buyTax > 0) {
                issues++
            }
            if(info.simulationResult.sellTax > 0) {
                issues++
            }
            if(!info.contractCode.openSource) {
                issues++
            }
            if(info.contractCode.isProxy) {
                issues++
            }
            if(info.contractCode.hasProxyCalls) {
                issues++
            }
            if(balance > 0) {
                issues++
            }
            if(owner !== ethers.ZeroAddress) {
                issues++
            }
            if(clog > 0) {
                issues++
            }
            if(whitelist) {
                issues++
            }
            if(blacklist) {
                issues++
            }
            if(taxMod) {
                issues++
            }
            if(mintable) {
                issues++
            }
            if(pausable) {
                issues++
            }
            if(cooldown) {
                issues++
            }
            if(!isAntiWhale) {
                issues++
            }

            await ctx.replyWithHTML(`<b>💎 ${info.token.name} | ${_chain} 💎</b>\n\n<b>Intel | ⛔️ ${issues} Issue(s) found.</b>\n\n<b>Buy Tax: ${info.simulationResult.buyTax > 0 ? "🚫" : "✅"} ${info.simulationResult.buyTax}%</b>\n\n<b>Sell Tax: ${info.simulationResult.sellTax > 0 ? "🚫" : "✅"} ${info.simulationResult.sellTax}%</b>\n\n<b>Tax Modifiable: ${taxMod ? "🚫" : "✅"} ${taxMod ? "Yes" : "No"}</b>\n\n<b>Clog: ${clog > 0 ? "🚫" : "✅"} ${clog > 0 ? "Yes" : "No"}</b>\n\n<b>Distributed Supply: ${balance > 0 ? "🚫" : "✅"} ${balance > 0 ? "Yes" : "No"}</b>\n\n<b>Ownership Renounced: ${owner !== ethers.ZeroAddress ? "🚫" : "✅"} ${owner == ethers.ZeroAddress ? "Yes" : "No"}</b>\n\n<b>HoneyPot: ${info.honeypotResult.isHoneypot ? "🚫" : "✅"} ${info.honeypotResult.isHoneypot ? "Yes" : "No"}</b>\n\n<b>Open Source: ${!info.contractCode.openSource ? "🚫" : "✅"} ${info.contractCode.openSource ? "Yes" : "No"}</b>\n\n<b>Proxy Contract: ${info.contractCode.isProxy ? "🚫" : "✅"} ${info.contractCode.isProxy ? "Yes" : "No"}</b>\n\n<b>External Calls: ${info.contractCode.hasProxyCalls ? "🚫" : "✅"} ${info.contractCode.hasProxyCalls ? "Yes" : "No"}</b>\n\n<b>Has Whitelist: ${whitelist ? "🚫" : "✅"} ${whitelist ? "Yes" : "No"}</b>\n\n<b>Has Blacklist: ${blacklist ? "🚫" : "✅"} ${blacklist ? "Yes" : "No"}</b>\n\n<b>Mintable: ${mintable ? "🚫" : "✅"} ${mintable ? "Yes" : "No"}</b>\n\n<b>Transfer pausable: ${pausable ? "🚫" : "✅"} ${pausable ? "Yes" : "No"}</b>\n\n<b>Trading Cooldown: ${cooldown ? "🚫" : "✅"} ${cooldown ? "Yes" : "No"}</b>\n\n<b>Is Anti Whale: ${!isAntiWhale ? "🚫" : "✅"} ${isAntiWhale ? "Yes" : "No"}</b>\n\n\n<i>Always DYOR. Scanners are not always 100% accurate.</i>`)
        } else {
            await ctx.replyWithHTML("<b>⛔️ Invalid Contract Address.</b>")
        }
    } catch (error) {
        await ctx.replyWithHTML("<b>🚨 An error occured while using the bot. Make sure you input the correct token CA on Ethereum.</b>")

        console.log(error)
    }
})

bot.command("scan", async ctx => {
    try {
        const address = ctx.args[0]
        console.log(address)

        if(address.length == 42) {
            const chain = await getChain(address)
            let _chain

            if(chain == "ethereum") {
                _chain = "ETH"
            } else if(chain == "base") {
                _chain = "BASE"
            }

            const info = await getTokenInfoI(address)
            const _info = await getTokenInfoII(info.pairAddress, chain)

            const ca = await getCaCreation(address, chain)
            const balance = await getBalance(ca.result[0].contractCreator, chain)

            const supply = await getSupply(address, info.token.decimals, chain)
            const balanceCA = await balanceOf(address, info.token.decimals, chain)
            const clog = (balanceCA / supply) * 100
            console.log(clog)

            const mc = getLocaleStr(_info.pair.fdv)
            const age = await getAge(_info.pair.pairCreatedAt)
            const block = await getBlock(info.pair.creationTxHash, chain)
            const logs = await getLogs(address, block, chain)

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
                `<b>💎 ${info.token.name} | ${_chain} 💎</b>\n\n<b>📌 Contract Address:</b><span class='tg-spoiler'>${info.token.address}</span>\n\n<b>🔱 Symbol:</b><span class='tg-spoiler'>$${info.token.symbol}</span>\n\n\n<b>🪙 Token Analytics: ⬇️</b>\n<b>---------------------------</b>\n\n<b>📊 Market Cap:$</b><span class='tg-spoiler'>${mc}</span>\n\n<b>💲 Price:</b><span class='tg-spoiler'>$${_info.pair.priceUsd} | ${_info.pair.priceNative} ${_info.pair.quoteToken.symbol}</span>\n\n<b>📈 PriceChange:</b><span class='tg-spoiler'>5M: ${_info.pair.priceChange.m5} | 1Hr: ${_info.pair.priceChange.h1} | 6Hr: ${_info.pair.priceChange.h6} | 24Hr: ${_info.pair.priceChange.h24}</span>\n\n<b>💸 Volume:</b><span class='tg-spoiler'>5M: ${getLocaleStr(_info.pair.volume.m5)} | 1Hr: ${getLocaleStr(_info.pair.volume.h1)} | 6Hr: ${getLocaleStr(_info.pair.volume.h6)} | 24Hr: ${getLocaleStr(_info.pair.volume.h24)}</span>\n\n<b>♻️ Buys/Sells:</b><span class='tg-spoiler'>5M: ${_info.pair.txns.m5.buys}/${_info.pair.txns.m5.sells} | 1Hr ${_info.pair.txns.h1.buys}/${_info.pair.txns.h1.sells} | 6Hr ${_info.pair.txns.h6.buys}/${_info.pair.txns.h6.sells} | 24Hr ${_info.pair.txns.h24.buys}/${_info.pair.txns.h24.sells}</span>\n\n<b>💰 Liquidity:</b><span class='tg-spoiler'>$${getLocaleStr(_info.pair.liquidity.usd)} | ${getLocaleStr(_info.pair.liquidity.base)} ${_info.pair.baseToken.symbol} | ${getLocaleStr(_info.pair.liquidity.quote)} ${_info.pair.quoteToken.symbol}</span>\n\n<b>🍯 Honeypot:</b><span class='tg-spoiler'>${info.honeypotResult.isHoneypot ? "Yes 🚫" : "No ✅"}</span>\n\n<b>🏦 Tax:</b><span class='tg-spoiler'>${Number(info.simulationResult.buyTax).toFixed(2)}% Buy | ${Number(info.simulationResult.sellTax).toFixed(2)}% Sell</span>\n\n<b>🕐 Age:</b><span class='tg-spoiler'>${age}</span>\n\n<b>🛡 Contract Verified:</b><span class='tg-spoiler'>${info.contractCode.openSource ? "Yes ✅" : "No 🚫"}</span>\n\n\n<b>👝 Wallet Insights: ⬇️</b>\n<b>---------------------------</b>\n\n<b>👝 Deployer Wallet:</b><span class='tg-spoiler'>${ca.result[0].contractCreator}</span>\n\n<b>💵 Deployer Balance:</b><span class='tg-spoiler'>${Number(balance).toFixed(3)} ETH</span>\n\n<b>🪠 Clog(% of tokens in the contract):</b><span class='tg-spoiler'>${Number(clog).toFixed(2)}%</span>\n\n\n<b>🚀 Sniper Data: ⬇️</b>\n<b>---------------------------</b>\n\n<b>🔫 ${logs.length} person(s) sniped in the first block.</b>\n\n${sniper_text}<b>💸 Total Sniper Volume:</b><span class='tg-spoiler'>${getLocaleStr(total_sniped_volume)} ${info.token.symbol}</span>\n\n\n<i>Always DYOR. Scanners are not always 100% accurate.</i>`,
                {
                    parse_mode : "HTML",
                    ...Markup.inlineKeyboard([
                        [Markup.button.url("Website", "info" in _info.pair && "websites" in _info.pair.info && _info.pair.info.websites.length > 0 ? _info.pair.info.websites[0].url : _info.pair.url)],
                        [Markup.button.url("Twitter", "info" in _info.pair && "socials" in _info.pair.info && _info.pair.info.socials.length > 0 ? _info.pair.info.socials[0].url : _info.pair.url)],
                        [Markup.button.url("Telegram", "info" in _info.pair && "socials" in _info.pair.info && _info.pair.info.socials.length > 1 ? _info.pair.info.socials[1].url : _info.pair.url)],
                        [Markup.button.url("Chart", _info.pair.url)]
                    ])
                }
            )
        } else {
            await ctx.replyWithHTML("<b>⛔️ Invalid Contract Address.</b>")
        }
    } catch (error) {
        await ctx.replyWithHTML("<b>🚨 An error occured while using the bot. Make sure you input the correct token CA on Ethereum.</b>")

        console.log(error)
    }
})

bot.launch()

process.once("SIGINT", () => bot.stop("SIGINT"))

process.once("SIGTERM", () => bot.stop("SIGTERM"))