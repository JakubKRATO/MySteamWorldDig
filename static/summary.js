const list = ["white", "red", "blue", "lime", "yellow", "orange", "green"]
const sleep = ms => new Promise(r => setTimeout(r, ms));

const calcXP = (time, money, tnt) => {
    const totalSeconds = time / 1000
    const minutes = Math.floor(totalSeconds / 60)

    // get XP from money
    var xp = money - 1000
    if (xp < 1) {
        xp = 2
    } else {
        xp = Math.ceil(xp / 100)
    }

    // get XP from TIME
    xp = xp + Math.floor(minutes / 25)

    // get XP from TNT
    let tnt_reward = tnt < 70 ? 5 : tnt < 100 ? 4 : tnt < 125 ? 3 : tnt < 150 ? 2 : 1

    xp = tnt_reward + xp

    return xp
};
document.addEventListener("DOMContentLoaded",async () => {
    await sleep(1000)
    const dataContainer = document.querySelector("#data")
    const time = parseInt(dataContainer.attributes["data-time"].value)
    const money = parseInt(dataContainer.attributes["data-money"].value)
    const tnt = parseInt(dataContainer.attributes["data-tnt"].value)
    const coins = parseInt(dataContainer.attributes["data-coins"].value)
    const XPdisplay = document.querySelector(".xp")
    const COINSdisplay = document.querySelector(".coins") 
    const XP = calcXP(time, money, tnt)
    console.log(time, money, tnt)
    console.log(`XP is ${XP}`);
    for (let i = 0;i < XP + 1; i++) {
        XPdisplay.innerHTML = `+ ${i} XP`
        XPdisplay.style.scale = "1"
        await sleep(100)
        XPdisplay.style.scale = "1.1"
        await sleep(100)
    }
    for (let i = 0;i < coins + 1; i++) {
        COINSdisplay.innerHTML = `${i} <img src="/static/img/coin.svg" alt="">`
        COINSdisplay.style.scale = "1"
        await sleep(100)
        COINSdisplay.style.scale = "1.1"
        await sleep(100)
    }
    
    document.querySelector("h2").innerHTML = "Congrats!"
    document.querySelector(".exit").style.visibility = "visible" 
    var i = 0;
    setInterval(() => {
        i = i > 6 ? 0 : i + 1
        document.querySelector("h2").style.color = list[i];
    }, 500);
});