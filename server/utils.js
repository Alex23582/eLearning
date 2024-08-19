const fs = require('fs/promises')

function formatTimeDate(seconds){
    const millis = seconds * 1000
    const d = new Date(millis)
    return `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`
}

function formatTime(seconds){
    const millis = seconds * 1000
    const d = new Date(millis)
    return `${d.getHours()}:${d.getMinutes()}`
}

async function getHWFiles(hwuuid, type){
    const path = `${__dirname}/files/homework/${hwuuid}/${type == 0 ? "giver" : "taker"}`
    const files = await fs.readdir(path)
    let result = []
    for(let i = 0; i < files.length; i++){
        const file = files[i]
        const d = new Date((await fs.stat(path + "/" + file)).mtimeMs)
        result.push({
            name: file,
            time: `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
        })
    }
    return result
}

module.exports = {formatTimeDate, formatTime, getHWFiles}