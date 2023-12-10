import { ethers } from "ethers"
import { config } from "dotenv"
import { PAIR_ABI } from "./config.js"

config()

export const getProvider = () => {
    return new ethers.JsonRpcProvider(process.env.MAINNET_API_URL)
}

export const getBlockTimestamp = async (tag) => {
    const block = await getProvider().getBlock(tag)
    console.log(block.timestamp)

    return block.timestamp
}

export const getLiquidity = async (address) => {
    const pair = new ethers.Contract(
        address,
        PAIR_ABI,
        getProvider()
    )

    const liquidity = await pair.getReserves()
    console.log(liquidity)

    const token = ethers.formatEther(liquidity[0])
    const wavax = ethers.formatEther(liquidity[1])
    console.log(token, wavax)

    return [Number(token).toFixed(2), Number(wavax).toFixed(2)]
}