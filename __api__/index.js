import axios from "axios"
import { config } from "dotenv"

config()

export const getTokenInfoI = async (address) => {
    try {
        const response = await axios.get(`https://api.honeypot.is/v2/IsHoneypot?address=${address}`)

        console.log(response.data)

        return response.data
    } catch (err) {
        console.log(err)
    }
}

export const getTokenInfoII = async (address) => {
    try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${address}`)

        console.log(response.data)

        return response.data
    } catch (err) {
        console.log(err)
    }
}