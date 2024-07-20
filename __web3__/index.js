import { ethers } from "ethers"
import { config } from "dotenv"
import { PAIR_ABI } from "./config.js"
import { getProvider } from "./init.js"
import { format } from "../__utils__/index.js"
import { getTokenInfoI } from "../__api__/index.js"

config()

export const getChain = async (address) => {
    const token = await getTokenInfoI(address)
    console.log(token.chain.shortName)

    if(token.chain.shortName == "eth") {
        return "ethereum"
    } else {
        return token.chain.shortName
    }
}

export const getBalance = async (address, chain) => {
    const balance = await getProvider(chain).getBalance(address)
    console.log(ethers.formatEther(balance))

    return ethers.formatEther(balance)
}

export const getBlock = async (hash, chain) => {
    const txn = await getProvider(chain).getTransaction(hash)
    console.log(txn)

    return txn.blockNumber
}

export const balanceOf = async (address, decimals, chain) => {
    const token = new ethers.Contract(
        address,
        PAIR_ABI,
        getProvider(chain)
    )

    const _balance = await token.balanceOf(address)
    const balance = format(decimals, _balance, "div")
    console.log(balance)

    return balance
}

export const getSupply = async (address, decimals, chain) => {
    const token = new ethers.Contract(
        address,
        PAIR_ABI,
        getProvider(chain)
    )

    const _supply = await token.totalSupply()
    const supply = format(decimals, _supply, "div")
    console.log(supply)

    return supply
}

export const getLogs = async (address, block, chain) => {
    const token = new ethers.Contract(
        address,
        PAIR_ABI,
        getProvider(chain)
    )

    const filter = token.filters.Transfer()
    console.log(filter)

    const logs = await token.queryFilter(filter, block, block)
    console.log(logs, logs.length)

    return logs
}

export const getOwner = async (address, abi, chain) => {
    const token = new ethers.Contract(
        address,
        abi,
        getProvider(chain)
    )

    const owner = await token.owner()
    console.log(owner)

    return owner
}