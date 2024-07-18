import { ethers } from "ethers"
import { config } from "dotenv"

config()

export const getProvider = (chain) => {
    if(chain == "ethereum") {
        return new ethers.JsonRpcProvider(process.env.MAINNET_API_URL)
    } else if(chain == "base") {
        return new ethers.JsonRpcProvider(process.env.BASE_API_URL)
    }
}