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
const calcTime = (time) => {
    const totalSeconds = time / 1000

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor(totalSeconds / 60 % 60)
    const seconds = Math.floor(totalSeconds % 60)

    return ` ${hours}h ${minutes}m ${seconds}s`
};


// console.log(calcXP(3085386, 3422, 115))
// console.log(calcTime(9876543))
