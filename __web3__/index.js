import { ethers } from "ethers"
import { config } from "dotenv"

config()

export const getProvider = () => {
    return new ethers.JsonRpcProvider(process.env.MAINNET_API_URL)
}

export const getBlockTimestamp = async () => {
    const block = await getProvider().getBlock("latest")
    console.log(block.timestamp)

    return block.timestamp
}