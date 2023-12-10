import { getBlockTimestamp } from "../__web3__/index.js"

export const getLocaleStr = (number) => {
    const options = {
        style : "decimal",
        minimumFractionDigits : 2,
        maximumFractionDigits : 2
    }

    return number.toLocaleString("en-US", options)
}

export const getAge = async (block) => {
    const now = await getBlockTimestamp("latest")
    const time = await getBlockTimestamp(block)
    const age = now - time
    console.log(time, now, age)

    const years = age / (365 * 24 * 60 * 60)
    const days = age / (24 * 60 * 60)
    const hours = age / (60 * 60)
    const minutes = age / 60

    if(years >= 1) {
        return `Created ${years.toFixed()} years ago`
    } else if(years <= 1 && days >= 1) {
        return `Created ${days.toFixed()} days ago`
    } else if(days <= 1 && hours >= 1) {
        return `Created ${hours.toFixed()} hours ago`
    } else if(days <= 1 && hours <=1 && minutes >= 1) {
        return `Created ${minutes.toFixed()} minutes ago`
    } else if(days <= 1 && hours <=1 && minutes <= 1 && age >= 1) {
        return `Created ${age} seconds ago`
    }
}