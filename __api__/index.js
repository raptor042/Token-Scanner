import axios from "axios"
import { config } from "dotenv"

config()

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY

export const getTokenInfoI = async (address) => {
    try {
        const response = await axios.get(`https://api.honeypot.is/v2/IsHoneypot?address=${address}`)
        console.log(response.data)

        return response.data
    } catch (e) {
        console.log(e)
    }
}

export const getTokenInfoII = async (address, chain) => {
    try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chain}/${address}`)
        console.log(response.data)

        return response.data
    } catch (e) {
        console.log(e)
    }
}

export const getCaCreation = async (address, chain) => {
    try {
        let response

        if(chain == "ethereum") {
            response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${ETHERSCAN_API_KEY}`)
        } else if(chain == "base") {
            response = await axios.get(`https://api.basescan.org/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${BASESCAN_API_KEY}`)
        }
        console.log(response.data)

        return response.data
    } catch (e) {
        console.log(e)
    }
}

export const getCaABI = async (address, chain) => {
    try {
        let response

        if(chain == "ethereum") {
            response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`)
        } else if(chain == "base") {
            response = await axios.get(`https://api.basescan.org/api?module=contract&action=getabi&address=${address}&apikey=${BASESCAN_API_KEY}`)
        }

        return response.data.result
    } catch (e) {
        console.log(e)
    }
}