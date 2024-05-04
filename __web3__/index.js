import { ethers } from "ethers"
import { config } from "dotenv"
import { PAIR_ABI } from "./config.js"
import { getProvider } from "./init.js"
import { format } from "../__utils__/index.js"

config()

export const getBalance = async (address) => {
    const balance = await getProvider().getBalance(address)
    console.log(ethers.formatEther(balance))

    return ethers.formatEther(balance)
}

export const getBlock = async (hash) => {
    const txn = await getProvider().getTransaction(hash)
    console.log(txn)

    return txn.blockNumber
}

export const balanceOf = async (address, decimals) => {
    const token = new ethers.Contract(
        address,
        PAIR_ABI,
        getProvider()
    )

    const _balance = await token.balanceOf(address)
    const balance = await format(decimals, _balance, "div")
    console.log(balance)

    return balance
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

export const getLogs = async (address, block) => {
    const token = new ethers.Contract(
        address,
        PAIR_ABI,
        getProvider()
    )

    const filter = token.filters.Transfer()
    console.log(filter)

    const logs = await token.queryFilter(filter, block, block)
    console.log(logs, logs.length)

    return logs
}