import axios from "axios"
import { config } from "dotenv"

config()

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

export const getTokenInfoI = async (address) => {
    try {
        const response = await axios.get(`https://api.honeypot.is/v2/IsHoneypot?address=${address}`)

        console.log(response.data)

        return response.data
    } catch (e) {
        console.log(e)
    }
}

export const getTokenInfoII = async (address) => {
    try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${address}`)

        console.log(response.data)

        return response.data
    } catch (e) {
        console.log(e)
    }
}

export const getCACreation = async (address) => {
    try {
        const response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=YourApiKeyToken`)

        console.log(response.data)

        return response.data
    } catch (e) {
        console.log(e)
    }
}   