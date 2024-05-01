import { ethers } from "ethers"
import { config } from "dotenv"
import { PAIR_ABI } from "./config.js"
import { getProvider } from "./init.js"

config()

export const getBlockTimestamp = async (tag) => {
    const block = await getProvider().getBlock(tag)
    console.log(block.timestamp)

    return block.timestamp
}

export const getSupply = async (address, decimals) => {
    const token = new ethers.Contract(
        address,
        PAIR_ABI,
        getProvider()
    )

    const _supply = await token.totalSupply()
    const supply = await format(decimals, _supply, "div")
    console.log(supply)

    return supply
}

export const format = async (decimals, value, denominator) => {
    let fmt_value

    if(denominator == "div") {
        fmt_value = Number(value) / (10 ** Number(decimals))
    } else {
        fmt_value = Number(value) * (10 ** Number(decimals))
    }

    return fmt_value
}