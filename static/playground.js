const startButton = document.getElementsByTagName("button")[0];
const game = document.getElementsByTagName("canvas")[0];
const canvas = game.getContext("2d");

const ShopElement = document.getElementsByClassName("upgrades")[0];
const li = ShopElement.getElementsByTagName("li")
const ToolsElement = document.getElementsByClassName("tools")[0];
const liTools = ToolsElement.getElementsByTagName("li")

const MAX_X = 100;
const MAX_Y = 100;

const DISPLAY_X = 40;
const DISPLAY_Y = 25;

const DISABLE_DARKNESS = false
const TILE_SIZE = 32; //32x32

const res = "1280x800";
game.width  = 1280;
game.height = 800;
var playing = false
var ended = false

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

    41: "rgba(85, 60, 60, 1)",
    42:  "rgba(92, 92, 92, 1)",
    43:  "rgba(59, 59, 59, 1)",
    44:  "rgba(20, 20, 20, 1)",
    45:  "rgba(0, 0, 0, 1)",

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

    // 535 : LOADED AT THE BOTTOM
    // 536 : LOADED AT THE BOTTOM
    // 537 : LOADED AT THE BOTTOM
    // 538 : LOADED AT THE BOTTOM
    // 539 : LOADED AT THE BOTTOM
    // 540 : LOADED AT THE BOTTOM


    // 991: LOADED AT THE BOTTOM,
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
    "Ruinite": 20,
    "Aurorite": 35,
    "Jakub": 50,
    "Blue Diamond": 500,
    "Horrorite": 0
}
const ores = {
    105: "Coal",
    115: "Iron",
    510: "Shredstone",
    520: "Egodite",
    530: "Ruinite",
    540: "Jakub",
    550: "Aurorite",
    1000: "Blue Diamond",
    1100: "Horrorite"
}
const Tools = {
    dynamite: {
            heading: "Jednoduchý dynamit",
            p: "Dynamit dokáže zničiť tvrdú stenu (krompáč nie)",
            tier: "",
            price: 7
    }
}
const Shop = {
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
        4: {
            heading: "Krompáč pravdy o duši",
            p: "Tento krompáč je ti nanič. Pravdepodobne. Keď nastane čas tak ti pomôže do hrobky kde ťa čaká test.",
            tier: "T-END... alebo?",
            price: 130
        },
        5: null
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
            p: "Všetko čo predáš má + 2 hodnotu!",
            tier: "T??",
            price: 25
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
            p: "Všetko čo predáš má + 6 hodnotu!",
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
        5: {
            heading: "Lampáš strýka Maťa",
            p: "Za jeho dedikáciu.. S týmto svetlom vyťažíš každú rudu v tomto svete",
            tier: "T5",
            price: 70
        },
        6: null
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
    compaas: {
        2: {
            heading: "Compaas",
            p: "Budeš vedieť ako hlboko si.",
            tier: "T1",
            price: 5
        },
        3: null
    },
    player: {
        pickaxe: 2,
        bag: 2,
        lamp: 2,
        swiftPickaxe: 2,
        cardio: 2,
        diagonal: 2,
        compaas: 2
    }
}
var player = {
    pos: {
        x: 5,
        y: 5
    },
    bag: [],
    bagSlots: 3,
    lamp: 5,
    pickStrength: 35, // base is 15
    money: 0,
    cardio: 3,
    swiftPickaxe: 3,
    midas: 0,
    diagonal: true,
    tools: {
        dynamite: 100
    },
    unlockedTools: ["dynamite"],
    selectedTool: 0,
    compaas: false
}
/* CONFIG AREA */
var world = [];

var cameraX = 0;
var cameraY = 0;
var moveCooldown = 0.5;
var keys = {}
var gameloop;

const main = async () => {
    document.getElementsByTagName("main")[0].style.display = "none";
    startButton.innerHTML = "Back to game";

    console.log("Generating new world...")
    generateWorld();
    shopRender();

    /* TESTING CHANGES TO THE WORLD SPACE*/
    
    /* TESTING CHANGES TO THE WORLD SPACE*/
    
    // Main game loop runs here (30 FPS)
    gameloop = setInterval(() => {
        updatePlayer()
        renderWorld()
        renderGUI()
        setDarkness()
        movementSpeed -= 0.033; // 33ms = 0.033s
        diggingSpeed -= 0.033;
    }, 33); // ~30 FPS
    
}
const generateWorld = async () => {
    for (let y = 0; y < MAX_Y; y++) {
        world.push([]);
        for (let x = 0; x < MAX_X; x++) {
            world[y][x] = {
                type: null,
                darkness: null
            }
            let randomNum1 = getRandomInt(0,1)
            world[y][x].type = 0
            if (y == 6) {
                world[y - randomNum1][x].type = 13
            }
            if (y > 5) {
                world[y][x].type = world[y][x].type == 13 ? 13 : 14 
            }
            
            // ores
            if (y > 7) {
                let randomNum1000 = getRandomInt(0,1000)
                if (randomNum1000 > 985) {
                    let random = getRandomInt(5,8)
                    for (let i = 0; i < random; i++) {
                        try {
                            world[y + getRandomInt(0,2) - 1][x + getRandomInt(0,2) - 1].type = randomNum1000 > 999 ? 504 : 102
                        } catch (error) {
                            console.log("error: Coal ore out of bounds");
                        }
                    }
                }
            }
        }
    }
    for (let y = 0; y < MAX_Y; y++) {
        for (let x = 0; x < MAX_X; x++) {
            if (MAX_Y - y == 1 || y == 0 || x == 0 || MAX_X - x == 1) {
                world[y][x].type = 999
            }
        }
    }
    updateWorld()
};


const updateWorld = () => {
    for (let y = 0; y < MAX_Y; y++) {
        for (let x = 0; x < MAX_X; x++) {
            world[y][x].ore = world[y][x].type > 100 && world[y][x].type < 990 ? true : false
            world[y][x].darkness = true
        }
    }
};
const renderWorld = () => {
    if (ended) return
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

            if ([534,535,536,537,538,539,540,546,547,548,549,550,994,995,996,991,997,1001,1002,1003,1000,1100].includes(block.type) && !block.darkness) {
                canvas.drawImage(colors[block.type], (x - startX) * TILE_SIZE, (y - startY) * TILE_SIZE, TILE_SIZE, TILE_SIZE)
                continue
            }
            
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
    let standing = world[player.pos.y + 1][player.pos.x].type > 12 ? true : false

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
            } else if (diggingSpeed < 0 && standing) {
                dig(player.pos.x, player.pos.y - 1)
                dug = true
            }
        }
        if (keys["a"]) {
            if (world[player.pos.y][player.pos.x - 1].type < 11 && movementSpeed < 0) {
                player.pos.x--;
                moved = true
            } else if (standing && diggingSpeed < 0) {
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
            } else if (standing && diggingSpeed < 0){
                dig(player.pos.x + 1, player.pos.y);
                dug = true
            }
        }
    }
    if (keys["ArrowRight"] && movementSpeed < 0 && world[player.pos.y][player.pos.x + 1].type < 13 && player.unlockedTools[player.selectedTool] == "dynamite" && player.tools["dynamite"] > 0 && standing) {
        boom(player.pos.x + 1 , player.pos.y)
        moved = true
    }
    if (keys["ArrowLeft"] && movementSpeed < 0 && world[player.pos.y][player.pos.x - 1].type < 13 && player.unlockedTools[player.selectedTool] == "dynamite" && player.tools["dynamite"] > 0 && standing) {
        boom(player.pos.x - 1 , player.pos.y)
        moved = true
    }
    if (keys["ArrowDown"] && movementSpeed < 0 && world[player.pos.y + 1][player.pos.x].type < 13 && player.unlockedTools[player.selectedTool] == "dynamite" && player.tools["dynamite"] > 0 && standing) {
        boom(player.pos.x , player.pos.y + 1)
        moved = true
    }
    // if (keys["f"] && movementSpeed < 0 && player.unlockedTools.length != 0) {
    //     moved = true
    // } I WILL IMPLEMENT THIS AFTER I ADD MORE TOOLS INTO THE GAME

    if (keys["Enter"] && movementSpeed < 0) {
        let block = world[player.pos.y][player.pos.x]
        if (block.type == 6) {

    
            let oldX = player.pos.x
            let oldY = player.pos.y
            player.pos.x = block.teleport.x
            player.pos.y = block.teleport.y
            if (player.pos.y < 7) {
                generateDoor(57, 6, oldX, oldY)
            }
            moved = true
        }
    }
    if (moved) {
        movementSpeed = player.cardio == 3 ? 0.16 : player.cardio == 2 ? 0.23 : 0.3
    }
    if (dug) {
        diggingSpeed = player.swiftPickaxe == 3 ? 0.16 : player.swiftPickaxe == 2 ? 0.23 : 0.3
    }
    if (keys["q"] && world[player.pos.y][player.pos.x].type == 3) { // Selling
        if (world[player.pos.y][player.pos.x].type != 3) return
        
        for (let i = 0; i < player.bagSlots; i++) {
            if (!!player.bag[i]) {
                player.money += parseInt(rewards[player.bag[i]] + player.midas);
            }
        }
        keys["q"] = false
        
        player.bag = []
    }
    
    if (world[player.pos.y][player.pos.x].type == 4 && world[player.pos.y][player.pos.x].obchod == 1) {
        shopRender()
        ShopElement.classList.remove("hide")
    } else if (world[player.pos.y][player.pos.x].type == 4 && world[player.pos.y][player.pos.x].obchod == 2) {
        toolShopRender()
        ToolsElement.classList.remove("hide")
    } else {
        ToolsElement.classList.add("hide")
        ShopElement.classList.add("hide")
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
        case 5:
            blocks = [-5 ,-4 ,-3, -2, -1, 0, 1, 2, 3, 4, 5]
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

    if (target == 997) {
        world[y][x].type = setWall(y,x)
        player.bag.push("INFO")
        return
    }
    if (target == 1000) {
        player.bag.push(ores[target])
        world[y][x].ore = false
        world[y][x].type = setWall(y,x)
        world[159][48].type = 999
        world[160][48].type = 999
        return
    }
    if (target == 1100) {
        player.bag.push(ores[target])
        world[y][x].ore = false
        world[y][x].type = setWall(y,x)
        world[159][58].type = 999
        world[160][58].type = 999
        return
    }
    if (target == 1001) {
        world[y][x].type = setWall(y,x)
        for (let y of [0,1,2,3]) {
            world[215 + y][44].type = 5
        }
        return
    }
    if (target == 1002) {
        for (let y of [0,1,2,3]) {
            world[215 + y][40].type = 5
        }
        world[y][x].type = setWall(y,x)
        return
    }
    if (target == 1003) {
        for (let y of [0,1,2,3]) {
            world[215 + y][42].type = 5
        }
        world[y][x].type = setWall(y,x)
        return
    }

    if (target > 990 && boom && !world[y][x].ore) {
        world[y][x].type = setWall(y,x)
    }
    if (boom && target.type == 991 || target.type == 992 || target.type == 993) {
        world[y][x].type = setWall(y,x)
    }
    if (boom && world[y][x].type > 100 && world[y][x].type < 990) {
        breakOre(x,y)
        return
    }

    if ((target > 10 && !(target > 990) && !(target % 10 == 5) && player.pickStrength >= target) || target > 100 && target < 990) {
        world[y][x].type++;
    } 
    
    if (target % 10 == 5 && target < 499 || target > 500 && target % 10 == 0) {
        if (target > 100 && target < 900 && !(player.bag.length > player.bagSlots - 1)) player.bag.push(ores[target])
        world[y][x].ore = false
        world[y][x].type = setWall(y,x)
    }
};
const setWall = (y, x) => {
    let type = world[y][x].type
    let wall = type > 26 ? 5 : type > 20 ? 2 : type > 10 ? 1 : 0
    return wall
};


const renderGUI = () => {
    if (ended) return
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
            canvas.fillRect(50, 100, 50, 50)
            canvas.fillStyle = "white"; 
            canvas.font = "16px Arial";
            canvas.textAlign = "center";
            canvas.textBaseline = "middle";
            canvas.fillText(player.tools["dynamite"], 75, 128);
            break;
    }
    if (player.compaas) {
        setColor("black");
        canvas.fillRect(20,50,90,30);
        setColor("white")
        canvas.strokeRect(20, 50, 90, 30)
        canvas.font = "16px Arial";
        canvas.fillStyle = "white";
        canvas.textAlign = "center";
        canvas.textBaseline = "middle";
        canvas.fillText(`Hĺbka: ${player.pos.y - 5}`,60, 67);
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
            try {                
                if (type) {
                    world[y - n][x + m].type = type
                    if (shopType != undefined) {
                        world[y - n][x + m].obchod = shopType
                    }
                }
                if (up) {
                    world[y - n][x + m].teleport = {x: 57, y: 5}
                } else world[y - n][x + m].teleport = {x: posX, y: posY}
            } catch (error) {
                console.log(error);
            }
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
    world[y][x].type = setWall(y,x)

};
const shopRender = () => {
    for (let i of li) {
        let left = i.children[0]
        let attribute = i.attributes["data"].value
        let data = Shop[attribute][Shop.player[attribute]]
        
        left.children[0].innerHTML = data.heading
        left.children[1].innerHTML = data.p
        left.children[2].innerHTML = data.tier

        // if price is MAX we set bg to gold and let the ptag display MAX, else show price
        if (data.price == "MAX") {
            i.style.backgroundColor = "gold"
            i.children[1].innerHTML = "MAX"
        } else {
            i.children[1].innerHTML = data.price + "$"
        }
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
    player.tools["dynamite"]--;
    let illegal = [3,4,6,999,41,994,995,996,997,1001,1002,1003,1000,1100]
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
const calcTime = (totalTime) => {
    let seconds = Math.floor(totalTime / 1000) % 60;
    let minutes = Math.floor(totalTime / (1000 * 60)) % 60;
    let hours   = Math.floor(totalTime / (1000 * 60 * 60));

    let formattedTime = 
        (hours > 0 ? hours + "h " : "") + 
        (minutes > 0 ? minutes + "m " : "") + 
        seconds + "s";

    return formattedTime

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

            let buySound = new Audio("static/sounds/buy.mp3")
            buySound.play()

            player.money -= price
            player.selectedTool = getIndex(attribute)
            
            switch (attribute) {
                case "dynamite":
                    console.log(player.tools);
                    
                    player.tools["dynamite"]++;
            }
        }
    });
});

// Shop logic
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
            let buySound = new Audio("static/sounds/buy.mp3")
            buySound.play()

            switch (attribute) {
                case "pickaxe":
                    player.pickStrength += 10;
                    break;

                case "bag":
                    if (Shop.player["bag"] == 7) {
                        player.midas = 6
                    } else if (Shop.player["bag"] == 5){
                        player.midas = 2
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
                case "compaas":
                    player.compaas = true;
                    break;
            }
        }
    }); 
});
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const loadTexture = (type, path) => {
    let img = new Image()
    img.src = path
    img.onload = () => {
        colors[type] = img
    };
    img.onerror = () => {
        console.log(`Failed to load texture ${type}`);
    };
};
shopRender()
toolShopRender()

// Rendering textures
loadTexture(991, "static/blocks/hard_wall.jpg");
loadTexture(994, "static/blocks/blue_wall.png");
loadTexture(995, "static/blocks/green_wall.png");
loadTexture(996, "static/blocks/white_wall.png");
loadTexture(1001, "static/blocks/white_key.png");
loadTexture(1002, "static/blocks/blue_key.png");
loadTexture(1003, "static/blocks/green_key.png");
loadTexture(997, "static/blocks/info.png");
loadTexture(1000, "static/blocks/blue_diamond.png");
loadTexture(1100, "static/blocks/horrorite.png");

// Load Jakub
for (let i = 1; i < 8; i++) {
    loadTexture(533 + i, `static/blocks/jakub${i}.png`);
}
// Load Aurorite
for (let i = 1; i < 6; i++) {
    loadTexture(545 + i, `static/blocks/Aurorite${i}.png`);
}

setInterval(() => {
    console.log(`world[${player.pos.y}][${player.pos.x}]`);
}, 500);
