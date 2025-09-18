const startButton = document.getElementsByTagName("button")[0];
const game = document.getElementsByTagName("canvas")[0];
const canvas = game.getContext("2d");

const ShopElement = document.getElementsByClassName("upgrades")[0];
const li = ShopElement.getElementsByTagName("li")
const ToolsElement = document.getElementsByClassName("tools")[0];
const liTools = ToolsElement.getElementsByTagName("li")

const MAX_X = 80;
const MAX_Y = 250;

const DISPLAY_X = 40;
const DISPLAY_Y = 25;

const DISABLE_DARKNESS = false
const TILE_SIZE = 32; //32x32

const res = "1280x800";
game.width  = 1280;
game.height = 800;
var playing = false

/* CONFIG AREA */
var movementSpeed = 0.3;
var diggingSpeed = 0.3;
const colors = {
    0: "white",
    1: "rgb(75, 39, 22)",
    2: "rgb(69, 79, 89)",
    3: "orange",
    4: "green",
    5: "rgba(75, 75, 75, 1)",
    6: "rgb(78, 95, 210)",

    13: "rgba(37, 164, 17, 1)",
    14: "sienna",
    15: "saddlebrown",

    23: "slategray",
    24: "darkgray",
    25: "gray",

    32: "rgba(101, 101, 101, 1)",
    33: "rgba(85, 85, 85, 1)",
    34: "rgba(71, 71, 71, 1)",
    35: "rgba(61, 61, 61, 1)",

    102: "rgb(28, 28, 28)",
    103: "rgb(40, 39, 39)",
    104: "rgb(46, 44, 44)",
    105: "rgb(59, 56, 56)",

    112: "rgba(134, 65, 16, 1)",
    113: "rgb(120, 61, 18)",
    114: "rgb(90, 45, 14)",
    115: "rgb(62, 30, 8)",

    504: "rgb(227, 41, 103)",
    505: "rgba(207, 30, 89, 1)",
    506: "rgba(198, 29, 85, 1)",
    507: "rgba(154, 30, 71, 1)",
    508: "rgba(122, 19, 53, 1)",
    509: "rgba(84, 13, 36, 1)",
    510: "rgba(57, 8, 24, 1)",

    514: "rgba(41, 227, 125, 1)",
    515: "rgba(20, 205, 103, 1)",
    516: "rgba(40, 176, 101, 1)",
    517: "rgba(43, 148, 90, 1)",
    518: "rgba(25, 113, 65, 1)",
    519: "rgba(12, 75, 40, 1)",
    520: "rgba(7, 51, 27, 1)",

    521: "rgba(207, 4, 4, 1)",
    522: "rgba(196, 12, 12, 1)",
    523: "rgba(189, 20, 20, 1)",
    524: "rgba(157, 7, 7, 1)",
    525: "rgba(156, 18, 18, 1)",
    526: "rgba(146, 14, 14, 1)",
    527: "rgba(133, 9, 9, 1)",
    528: "rgba(126, 15, 15, 1)",
    529: "rgba(115, 10, 10, 1)",
    530: "rgba(101, 6, 6, 1)",


    991: "rgba(255, 136, 0, 1)",
    992: "rgba(255, 0, 0, 1)",
    993: "rgba(255, 255, 255, 1)",

    999: "rgba(9, 0, 37, 1)",
    BagSlotsColor: "rgba(26, 26, 26, 0.2)"
}
const rewards = {
    "Coal": 1,
    "Iron": 3,
    "Shredstone": 5,
    "Egodite": 11,
    "Ruinite": 20
}
const ores = {
    105: "Coal",
    115: "Iron",
    510: "Shredstone",
    520: "Egodite",
    530: "Ruinite"
}
const Tools = JSON.parse(localStorage.getItem("Tools")) || {
    dynamite: {
            heading: "Jednoduchý dynamit",
            p: "Dynamit dokáže zničiť tvrdú stenu (krompáč nie)",
            tier: "",
            price: 10
    }
}
const Shop = JSON.parse(localStorage.getItem("Shop")) || {
    pickaxe: {
        2: {
            heading: "Kamený Krompáč",
            p: "S týmto krompáčom môžeš vyťažiť KAMEŇ!",
            tier: "T2",
            price: 15
        },
        3: {
            heading: "Železný Krompáč",
            p: "S týmto krompáčom môžeš vyťažiť TMAVÝ KAMEŇ!",
            tier: "T3",
            price: 65
        },
        4: null,
    },
    bag: {
        2: {
            heading: "Malý batoh",
            p: "Vedieť niesť iba 3 kamene je celkom otravné nie? Nos 4!",
            tier: "T2",
            price: 10
        },
        3: {
            heading: "Stredný batoh",
            p: "S týmto batohom budeš môcť odniesť až 5 kameňov",
            tier: "T3",
            price: 19
        },
        4: {
            heading: "Midasov Dych",
            p: "Všetko čo predáš má + 1 hodnotu!",
            tier: "T??",
            price: 80
        },
        5: {
            heading: "Jakubova Gym Taška",
            p: "Do môjej gym tašky sa zmestí aj 6 kameňov!",
            tier: "T4",
            price: 35
        },
        6: {
            heading: "Jakubova školská Taška",
            p: "Do môjho batohu sa zmestí takmer všetko...",
            tier: "T5",
            price: 50
        },
        7: {
            heading: "Midasov Dotyk",
            p: "Všetko čo predáš má + 4 hodnotu!",
            tier: "T??",
            price: 80
        },
        8: null
    },
    lamp: {
        2: {
            heading: "Stará sviečka",
            p: "S touto premium sviečkou by si mal vidieť lepšie v tých baniach",
            tier: "T2",
            price: 15
        },
        3: {
            heading: "Baterka z telefónu ON",
            p: "Premýšlal si nad tým že by si si zapol bateku na mobile?",
            tier: "T3",
            price: 30
        },
        4: {
            heading: "Ultra Lumen 3000",
            p: "S touto baterkou určite nájdeš aj skrytý JAKUBOV KAMEŇ... nikomu o ňom nehovor",
            tier: "T4",
            price: 55
        },
        5: null
    },
    swiftPickaxe: {
        2: {
            heading: "Rýchly krompáč",
            p: "Toto špeciálne vylepšenie zrýchli tvoj krompáč o 33.5%      <- číslo som si vymyslel",
            tier: "T2",
            price: 30
        },
        3: {
            heading: "Horiaci krompáč",
            p: "Tvoj krompáč ničí kameňe ako nôž cez maslo",
            tier: "T3",
            price: 90
        },
        4: null
    },
    cardio: {
        2: {
            heading: "Cardio",
            p: "Konečne si prestal skipovať cardio v gyme a oplatilo sa! + 5 reputácia a zrýchelný pohyb!",
            tier: "T2",
            price: 50
        },
        3: {
            heading: "Útek z kardio zóny",
            p: "Odteraz utekáš tak rýchlo ako Jakub z kardio zóny",
            tier: "T3",
            price: 90
        },
        4: null
    },
    diagonal: {
        2: {
            heading: "Diagonálny Teleport",
            p: "Naučil si sa novú techniku teleportovania!",
            tier: "T??",
            price: 30
        },
        3: null
    },
    player: {
        pickaxe: 2,
        bag: 2,
        lamp: 2,
        swiftPickaxe: 2,
        cardio: 2,
        diagonal: 2
    }
}
// var player = JSON.parse(localStorage.getItem("player")) || {
//     pos: {
//         x: 39,
//         y: 5
//     },
//     bag: [],
//     bagSlots: 3,
//     lamp: 1,
//     pickStrength: 15,
//     money: 990,
//     cardio: 1,
//     swiftPickaxe: 1,
//     midas: 0,
//     diagonal: true,
//     tools: {
//         dynamite: 0
//     },
//     unlockedTools: [],
//     selectedTool: null
// }
var player = {
    pos: {
        x: 39,
        y: 5
    },
    bag: [],
    bagSlots: 3,
    lamp: 1,
    pickStrength: 15,
    money: 990,
    cardio: 1,
    swiftPickaxe: 1,
    midas: 0,
    diagonal: true,
    tools: {
        dynamite: 0
    },
    unlockedTools: [],
    selectedTool: null
}
/* CONFIG AREA */
var world = [];

var cameraX = 0;
var cameraY = 0;
var moveCooldown = 0.5;
var keys = {}


const main = () => {
    startButton.innerHTML = "Back to game";
    document.getElementsByTagName("main")[0].style.display = "none";
    if (!localStorage.getItem("world")) {
        console.log("Generating new world...")
        generateWorld();
    } else {
        world = JSON.parse(localStorage.getItem("world"))
    }
    surfaceDarkness();
    shopRender()

    // Hiding shop
    ShopElement.style.display = "none";
    
    // Setup SELL ZONE
    generateDoor(41, 6, 0, 0, false, 3)
    
    // SetupSHOP
    generateDoor(34, 6, 0, 0, false, 4, 1)
    
    let f = getRandomInt(10,70)
    let n = getRandomInt(80, 83)
    generateDoor(f, n, 0, 0, true)

    /* GENERATE DUNGEONS */
    generateDungeon1()

    // Main game loop runs here (30 FPS)
    setInterval(() => {
        updatePlayer()
        renderWorld()
        renderGUI()
        setDarkness()
        movementSpeed -= 0.033; // 33ms = 0.033s
        diggingSpeed -= 0.033;
    }, 33); // ~30 FPS

}

const generateWorld = () => {
    for (let y = 0; y < MAX_Y; y++) {
        world.push([]);
        for (let x = 0; x < MAX_X; x++) {
            world[y][x] = {
                type: null,
                darkness: null
            }
            if (y == MAX_Y - 1) {
                world[y][x].type = 999
                world[y][x].darkness = false
            } else if (y > 80) {
                world[y][x].type = 32
                if (y > 83) {
                    let n = getRandomInt(1,30)
                    world[y][x].type = n == 1 ? 504 : 32
                }
                world[y][x].darkness = true
            } else if (y > 20) {
                world[y][x].type = 23
                if (y > 21) {
                    let n = getRandomInt(1,28)
                    if (n == 1) world[y][x].type = 112
                    if (y > 26) {
                        n = getRandomInt(1,190)
                        if (y > 55) {
                            n = getRandomInt(1,130)
                        }
                        if (n == 1) world[y][x].type = 514
                    }
                }
                if (y == 80) {
                    world[y][x].type = getRandomInt(1,4) == 1 ? 23 : 32
                }
                world[y][x].darkness = true
            } else if (y > 5) {
                world[y][x].type = 14
                if (y > 7) {
                    let n = getRandomInt(1,20)
                    if (n == 1) world[y][x].type = 102
                    if (y > 9) {
                        n = getRandomInt(1,95)
                        if (y > 15) {
                            n = getRandomInt(1,60)
                        }
                        if (n == 1) world[y][x].type = 504
                    }
                }
                if (y == 6) {
                    world[y][x].type = 13
                }
                if (y == 20) {
                    world[y][x].type = getRandomInt(1,4) == 1 ? 14 : 23
                }
                world[y][x].darkness = true
            } else {
                world[y][x].type = 0
                world[y][x].darkness = false
            }
            world[y][x].color = colors[world[y][x].type]
        }
    }
    updateWorld()
};
const updateWorld = () => {
    for (let y = 0; y < MAX_Y; y++) {
        for (let x = 0; x < MAX_X; x++) {
            world[y][x].ore = world[y][x].type > 100 && world[y][x].type < 990 ? true : false
        }
    }
};
const renderWorld = () => {
    // --- CAMERA (tile-based) ---
    cameraX = player.pos.x - Math.floor(DISPLAY_X / 2);
    cameraY = player.pos.y - Math.floor(DISPLAY_Y / 2);
    
    // clamp so we never point outside the map
    cameraX = Math.max(0, Math.min(cameraX, MAX_X - DISPLAY_X));
    cameraY = Math.max(0, Math.min(cameraY, MAX_Y - DISPLAY_Y));
    
    // cache for readability
    const startX = cameraX;
    const startY = cameraY;
    var block;

    canvas.clearRect(0, 0, game.width, game.height);

    for (let y = cameraY; y < cameraY + DISPLAY_Y; y++) {
        for (let x = cameraX; x < cameraX + DISPLAY_X; x++) {
            
            block = world[y][x];
            if (block.darkness && block.type != 0 && !DISABLE_DARKNESS || block.doorDarkness && y > 7) {
                setColor("black")
            } else {
                setColor(colors[block.type])
            }
            try {
                canvas.fillRect(
                    (x - startX) * TILE_SIZE,
                    (y - startY) * TILE_SIZE,
                    TILE_SIZE, TILE_SIZE
                );
            } catch (error) {
                continue
            }
        }
    }

    // now we draw the player
    setColor("deepskyblue");
    canvas.fillRect(
      (player.pos.x - startX) * TILE_SIZE,
      (player.pos.y - startY) * TILE_SIZE,
      TILE_SIZE, TILE_SIZE
    );

};

const updatePlayer = () => {    
    let moved = false
    let dug = false

    if (player.diagonal) {
        if (keys["w"] && keys["a"]) {
            if (world[player.pos.y - 1][player.pos.x - 1].type <= 10 && movementSpeed < 0) {
                player.pos.x = player.pos.x - 1
                player.pos.y = player.pos.y - 1
                moved = true
            }
        }
        if (keys["w"] && keys["d"]) {
            if (world[player.pos.y - 1][player.pos.x + 1].type <= 10 && movementSpeed < 0) {
                player.pos.x = player.pos.x + 1
                player.pos.y = player.pos.y - 1
                moved = true
            }
        }
        if (keys["s"] && keys["a"]) {
            if (world[player.pos.y + 1][player.pos.x - 1].type <= 10 && movementSpeed < 0) {
                player.pos.x = player.pos.x - 1
                player.pos.y = player.pos.y + 1
                moved = true
            }
        }
        if (keys["s"] && keys["d"]) {
            if (world[player.pos.y + 1][player.pos.x + 1].type <= 10 && movementSpeed < 0) {
                player.pos.x = player.pos.x + 1
                player.pos.y = player.pos.y + 1
                moved = true
            }
        }
    }

    if (!moved) {
        if (keys["w"]) {
            if (world[player.pos.y - 1][player.pos.x].type < 11 && movementSpeed < 0) {
                player.pos.y--;
                moved = true
            }
        }
        if (keys["a"]) {
            if (world[player.pos.y][player.pos.x - 1].type < 11 && movementSpeed < 0) {
                player.pos.x--;
                moved = true
            } else if (world[player.pos.y + 1][player.pos.x].type > 12 && diggingSpeed < 0) {
                dig(player.pos.x - 1, player.pos.y)
                dug = true
            }
        }
        if (keys["s"]) {
            if (world[player.pos.y + 1][player.pos.x].type < 11 && movementSpeed < 0) {
                player.pos.y++;
                moved = true
            } else if (diggingSpeed < 0){
                dig(player.pos.x, player.pos.y + 1);
                dug = true
            }
        }
        if (keys["d"]) {
            if (world[player.pos.y][player.pos.x + 1].type < 11 && movementSpeed < 0) {
                player.pos.x++;
                moved = true
            } else if (world[player.pos.y + 1][player.pos.x].type > 12 && diggingSpeed < 0){
                dig(player.pos.x + 1, player.pos.y);
                dug = true
            }
        }
    }
    if (keys["ArrowRight"] && movementSpeed < 0 && world[player.pos.y][player.pos.x + 1].type < 13 && player.unlockedTools[player.selectedTool] == "dynamite") {
        boom(player.pos.x + 1 , player.pos.y)
        moved = true
    }
    if (keys["ArrowLeft"] && movementSpeed < 0 && world[player.pos.y][player.pos.x - 1].type < 13 && player.unlockedTools[player.selectedTool] == "dynamite") {
        boom(player.pos.x - 1 , player.pos.y)
        moved = true
    }
    if (keys["ArrowDown"] && movementSpeed < 0 && world[player.pos.y + 1][player.pos.x].type < 13 && player.unlockedTools[player.selectedTool] == "dynamite") {
        boom(player.pos.x , player.pos.y + 1)
        moved = true
    }
    // if (keys["f"] && movementSpeed < 0 && player.unlockedTools.length != 0) {
    //     moved = true
    // } I WILL IMPLEMENT THIS AFTER I ADD MORE TOOLS INTO THE GAME

    if (keys["Enter"] && movementSpeed < 0) {
        let block = world[player.pos.y][player.pos.x]

        if (block.type != 6) return
        let oldX = player.pos.x
        let oldY = player.pos.y
        player.pos.x = block.teleport.x
        player.pos.y = block.teleport.y
        if (player.pos.y < 7) {
            generateDoor(47, 6, oldX, oldY)
        }
        moved = true
    }
    if (moved) {
        movementSpeed = player.cardio == 3 ? 0.16 : player.cardio == 2 ? 0.23 : 0.3
    }
    if (dug) {
        diggingSpeed = player.swiftPickaxe == 3 ? 0.16 : player.swiftPickaxe == 2 ? 0.23 : 0.3
    }
    if (keys["q"]) { // Selling
        if (world[player.pos.y][player.pos.x].type != 3) return
        
        for (let i = 0; i < player.bagSlots; i++) {
            if (!!player.bag[i]) {
                player.money += parseInt(rewards[player.bag[i]] + player.midas);
            }
        }
        player.bag = []
    }
    
    if (world[player.pos.y][player.pos.x].type == 4 && world[player.pos.y][player.pos.x].obchod == 1) {
        shopRender()
        ShopElement.style.display = "flex"
    } else if (world[player.pos.y][player.pos.x].type == 4 && world[player.pos.y][player.pos.x].obchod == 2) {
        toolShopRender()
        ToolsElement.style.display = "flex"
    } else {
        ToolsElement.style.display = "none"
        ShopElement.style.display = "none"
    }
};

const setDarkness = () => {
    let blocks;
    switch (player.lamp) {
        case 1:
            blocks = [-1, 0, 1]
            break
        case 2:
            blocks = [-2, -1, 0, 1, 2]
            break
        case 3:
            blocks = [-3, -2, -1, 0, 1, 2, 3]
            break
        case 4:
            blocks = [-4 ,-3, -2, -1, 0, 1, 2, 3, 4]
            break

    }

    for (let y of blocks) {
        for (let x of blocks) {
            try {
                world[player.pos.y + y][player.pos.x + x].darkness = false
                world[player.pos.y + y][player.pos.x + x].doorDarkness = false
            } catch (error) {
                continue
            }
        }
    }
};

const dig = (x,y, boom) => {
    let target = world[y][x].type;
    if (target < 12) return

    if (target > 990 && boom && !world[y][x].ore) {
        world[y][x].type = setWall(y)
    }
    if (boom && target.type == 991 || target.type == 992 || target.type == 993) {
        world[y][x].type = setWall(y)
    }
    if (boom && world[y][x].ore) {
        breakOre(x,y)
    }

    if ((target > 10 && !(target > 990) && !(target % 10 == 5) && player.pickStrength >= target) || target > 100 && target < 990) {
        world[y][x].type++;
    } 
    
    if (target % 10 == 5 && target < 499 || target > 500 && target % 10 == 0) {
        if (target > 100 && target < 900 && !(player.bag.length > player.bagSlots - 1)) player.bag.push(ores[target])
        world[y][x].ore = false
        world[y][x].type = setWall(y)
    }
};
const setWall = (y) => {
    if (y < 6) {
        return 0
    }
    if (y < 21) {
        return 1
    }
    if (y < 81) {
        return 2
    }
    return 5
};


const renderGUI = () => {
    const slotsize = 100
    const margin = 20
    
    const totalWidth = player.bagSlots * slotsize + (player.bagSlots - 1) * margin
    const startPosX = (game.width - totalWidth) / 2
    const y = game.height - 120
    for (let i = 0; i < player.bagSlots; i++) {
        let x = startPosX + i * (slotsize + margin)
        
        setColor(colors.BagSlotsColor)
        canvas.fillRect(x, y, slotsize, slotsize)
        
        canvas.strokeStyle = "rgb(35, 35, 35)"
        canvas.lineWidth = 2
        canvas.strokeRect(x,y, slotsize, slotsize)
        
        if (player.bag[i]) {
            canvas.fillStyle = "white"; 
            canvas.font = "16px Arial";
            canvas.textAlign = "center";
            canvas.textBaseline = "middle";
            canvas.fillText(player.bag[i], x + slotsize / 2, y + slotsize / 2);
        }
    }
    setColor("rgba(13, 13, 13, 1)")
    canvas.fillRect(20, 20, 40, 20)
    canvas.strokeRect(20, 20, 40, 20)
    canvas.fillStyle = "white"; 
    canvas.font = "16px Arial";
    canvas.textAlign = "center";
    canvas.textBaseline = "middle";
    canvas.fillText(player.money + "$", 40, 32);

    // rendering our equiped tool
    switch (player.selectedTool) {
        case null:
            break;
        case 0:
            setColor("red")
            canvas.fillRect(50, 50, 50, 50)
            break;
    }
};
const generateDoor = (x,y,posX,posY, up, type, shopType) => {
    for (let n of [3,2,1,0]) {
        for (let m of [3,2,1,0]) {
            let block = world[y - n][x + m].type
            world[y - n][x + m].type = setWall(y - n)
            world[y - n][x + m].doorDarkness = block <= 10 ? false : true
        }
    }
    for (let n of [0,1,2,3]) {
        world[y][x + n].type = 999
    }
    for (let n of [1,2]) {
        for (let m of [1,2]) {
            world[y - n][x + m].type = 6
            if (type) {
                world[y - n][x + m].type = type
                if (shopType != undefined) {
                    world[y - n][x + m].obchod = shopType
                }
            }
            if (up) {
                world[y - n][x + m].teleport = {x: 47, y: 5}
            } else world[y - n][x + m].teleport = {x: posX, y: posY}
        }
    }
};
const breakOre = (x,y) => {
    let block = world[y][x].type
    while (!(block % 10 == 5 && block < 499 || block > 500 && block % 10 == 0)) {
        block++;
    }
    player.bag.push(ores[block])
    world[y][x].ore = false
    world[y][x].type = setWall(y)

};
const shopRender = () => {
    for (let i of li) {
        let left = i.children[0]
        let attribute = i.attributes["data"].value
        let data = Shop[attribute][Shop.player[attribute]]
        
        left.children[0].innerHTML = data.heading
        left.children[1].innerHTML = data.p
        left.children[2].innerHTML = data.tier
        i.children[1].innerHTML = data.price == "MAX" ? "MAX" : data.price + "$"
    }
};
const toolShopRender = () => {
    for (let i of liTools) {
        let left = i.children[0]
        let attribute = i.attributes["data"].value
        let data = Tools[attribute]

        left.children[0].innerHTML = data.heading
        left.children[1].innerHTML = data.p
        left.children[2].innerHTML = data.tier
        i.children[1].innerHTML = data.price + "$"
    }
};
const boom = async (x,y) => {
    let illegal = [3,4,6,999]
    if (illegal.includes(world[y][x].type)) return

    let block = world[y][x]
    world[y][x].type = 992
    for (let i = 0; i < 4; i++) {
        let type = world[y][x].type
        await sleep(300)
        if (type == 992) {
            world[y][x].type = 993
        } else {
            world[y][x].type = 992
        }
    }
    for (let yt of [-1,0,1]) {
        for (let xt of [-1,0,1]) {
            if (!(illegal.includes(world[y + yt][x + xt].type))) {
                dig(x + xt, y + yt, true)
                world[y + yt][x + xt].type = setWall(y + yt)
                world[y + yt][x + xt].ore = false
            }
        }
    }
    world[y][x] = block
}
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}
const surfaceDarkness = () => {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < MAX_X; x++) {
            let blocks
            try {
                blocks = [world[y - 1][x].type, world[y - 2][x].type, world[y - 3][x].type]
            } catch (error) {
                world[y][x].darkness = false
                continue
            }
            for (let i = 0; i < 10; i++) {
                if (blocks.includes(i)) {
                    world[y][x].darkness = false
                }
            }
        }
    }
};
const generateDungeon1 = () => {
    let randomX = getRandomInt(5,10)
    let randomY = getRandomInt(47,75)
    for (let x = randomX; x < randomX + 36; x++) {
        for (let y = randomY; y > randomY - 20; y--) {
            world[y][x].type = 999
            world[y][x].darkness = true
        }
    }
    generateDoor(randomX, randomY, 0, 0, true)
    generateDoor(randomX + 32, randomY, randomX, randomY - 1)
    for (let y of [1,2,3,4,5]) {
        world[randomY - y][randomX + y + 3].type = 2    
    }
    for (let y of [3,2,1]) {
        world[randomY - y - 4][randomX - y + 9].type = 2
        console.log(y - 4, y + 9);
    }
    for (let y of [0,1,2,3]) {
        for (let x of [0,1,2,3,4]) {
            world[randomY - 7 - y][randomX + 6 - x].type = 2
        }
    }
    world[randomY - 7][randomX + 2].type = 514
    world[randomY - 7][randomX + 3].type = 514
    for (let x of [0,1,2,3,4,5]) {
        world[randomY - 8][randomX + 7 + x].type = 2
    }
    generateDoor(randomX + 12, randomY - 7, randomX + 19, randomY - 2)
    generateDoor(randomX + 19, randomY - 1, randomX + 12, randomY - 8)
    let counter = 0;
    while (counter < 5) {
        let x = counter % 2 == 1 ? 1 : 2
        world[randomY - 5 - counter][randomX + 16 + x].type = 2
        counter++;
    }
    for (let y of [1,2,3]) {
        for (let x of [2,3,4,5,6]) {
            world[randomY - 9 - y][randomX + 17 + x].type = 2
        }
    }
    generateDoor(randomX + 20, randomY - 8, 0, 0, false, 4, 2)
    for (let x of [0,1,2,3]) {
        world[randomY - 9][randomX + 24 + x].type = 2
    }
    for (let y of [0,1,2]) {
        for (let x of [0,1,2]) {
            world[randomY - 9 - y][randomX + 27 + x].type = 2
        }
    }
    for (let x of [0,1,2]) {
        world[randomY - 8][randomX + 27 + x].type = 991
    }
    for (let y of [0,1,2]) {
        for (let x of [0,1,2,3,4]) {
            world[randomY - 7 + y][randomX + 26 + x].type = 2
        }
    }
    world[randomY - 5][randomX + 28].type = 521
};
const setColor = (color) => {
    canvas.fillStyle = color
};
startButton.addEventListener("click",() => {
    if (playing != true) {
        main()
        playing = true
    }
    game.requestFullscreen();
});
const getIndex = (word) => {
    for (let i = 0; i < player.unlockedTools.length; i++) {
        if (player.unlockedTools[i] == word) return i
    }
};
Array.from(liTools).forEach(element => {
    element.addEventListener("click", () => {
        let attribute = element.attributes["data"].value
        let price = Tools[attribute].price
        
        if (price <= player.money) {
            if (!player.unlockedTools.includes(attribute)) player.unlockedTools.push(attribute)

            let buySound = new Audio("sounds/buy.mp3")
            buySound.play()

            player.money -= price
            player.selectedTool = getIndex(attribute)
            console.log(player.selectedTool);
            
            switch (attribute) {
                case "dynamite":
                    player.tools["dynamite"]++;
            }
        }
    });
});
Array.from(li).forEach(element => {
    element.addEventListener("click",async () => {
        let attribute = element.attributes["data"].value
        let price = Shop[attribute][Shop.player[attribute]].price
        
        if (price <= player.money) {
            player.money -= price
            
            if (Shop[attribute][Shop.player[attribute] + 1] == null) {
                Shop[attribute][Shop.player[attribute]].price = "MAX"
                element.style.backgroundColor = "gold"
            } else {
                Shop.player[attribute]++;
            }
            shopRender()
            let buySound = new Audio("sounds/buy.mp3")
            buySound.play()

            switch (attribute) {
                case "pickaxe":
                    player.pickStrength += 10;
                    break;

                case "bag":
                    if (Shop.player["bag"] == 6) {
                        player.midas = 4
                    } else if (Shop.player["bag"] == 4){
                        player.midas = 1
                    } else {
                        player.bagSlots++;
                    }
                    break;

                case "lamp":
                    player.lamp++;
                    break;

                case "swiftPickaxe":
                    player.swiftPickaxe++;
                    break;

                case "cardio":
                    player.cardio++;
                    break;
                case "diagonal":
                    player.diagonal = true;
                    break;
            }
            let all = true
            for (let i of Object.keys(Shop)) {
                if (i == "player" || Shop[i][Shop.player[i]].price == "MAX") continue
                all = false
            }
            if (all) {
                let end = new Audio("sounds/end.mp3")
                end.volume = 0.05
                await end.play()
                alert("Gratulujem! Získal si všetko. Čo teraz?")
            }
        }
    }); 
});

document.getElementsByClassName("functional")[0].addEventListener("click",() => {
    try {
        localStorage.setItem("world", JSON.stringify(world))
        localStorage.setItem("Shop", JSON.stringify(Shop))
        localStorage.setItem("player", JSON.stringify(player))
        localStorage.setItem("Tools", JSON.stringify(Tools))
        alert("Current state of the game has been saved to your device local storage!")
    } catch (error) {
        console.log(error);
        alert("Error saving progress!")
    }
});
document.getElementsByClassName("functional")[1].addEventListener("click",() => {
    try {
        localStorage.clear()
        alert("Enjoy your new fresh start!")
        window.location.reload();
    } catch (error) {
        console.log(error);
        alert("Error restaring game!")
    }
});
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

shopRender()
toolShopRender()