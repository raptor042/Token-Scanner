import axios from "axios"
import { config } from "dotenv"

config()

export const getTokenInfo = async (address) => {
    try {
        const response = await axios.get(`https://api.dextools.io/v1/token?chain=avalanche&address=${address}`, {
            headers: {
                "X-API-Key" : process.env.DEXTOOLS_API_KEY
            }
        })

        console.log(response.data)

        return response.data
    } catch (err) {
        console.log(err)
    }
}