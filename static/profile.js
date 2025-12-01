const timeDisplay = document.querySelector("#time")
const timeData = parseInt(document.querySelector("#data").attributes["data-time"].value)

const calcTime = (time) => {
    const totalSeconds = time / 1000

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor(totalSeconds / 60 % 60)
    const seconds = Math.floor(totalSeconds % 60)
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
};

if (isNaN(timeData)) {
    timeDisplay.innerHTML = "Best time: N/A"
} else {
    timeDisplay.innerHTML = `Best time: ${calcTime(timeData)}`
}