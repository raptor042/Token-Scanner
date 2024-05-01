import { getBlockTimestamp } from "../__web3__/index.js"

export const getLocaleStr = (number) => {
    const options = {
        style : "decimal",
        minimumFractionDigits : 0,
        maximumFractionDigits : 2
    }

    return number.toLocaleString("en-US", options)
}

export const getAge = async (ms) => {
    const now = Date.now() / 1000
    const time = Number(ms) / 1000
    const age = now - time
    console.log(time, now, age)

    const years = age / (365 * 24 * 60 * 60)
    const days = age / (24 * 60 * 60)
    const hours = age / (60 * 60)
    const minutes = age / 60

    if(years >= 1) {
        return `Created ${years.toFixed()} year(s) ago`
    } else if(years <= 1 && days >= 1) {
        return `Created ${days.toFixed()} day(s) ago`
    } else if(days <= 1 && hours >= 1) {
        return `Created ${hours.toFixed()} hour(s) ago`
    } else if(days <= 1 && hours <=1 && minutes >= 1) {
        return `Created ${minutes.toFixed()} minute(s) ago`
    } else if(days <= 1 && hours <=1 && minutes <= 1 && age >= 1) {
        return `Created ${age} second(s) ago`
    }
}