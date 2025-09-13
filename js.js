const startButton = document.getElementsByTagName("button")[0];
const game = document.getElementsByTagName("canvas")[0];
const canvas = game.getContext("2d");

const ShopElement = document.getElementsByClassName("shop")[0];
const li = ShopElement.getElementsByTagName("li")

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
    5: "rgba(10, 10, 10, 1)",

    13: "sienna",
    14: "saddlebrown",
    15: "maroon",

    23: "slategray",
    24: "darkgray",
    25: "gray",

    33: "rgba(48, 48, 48, 1)",
    34: "rgba(38, 36, 36, 1)",
    35: "rgba(20, 20, 20, 1)",

    102: "rgb(28, 28, 28)",
    103: "rgb(40, 39, 39)",
    104: "rgb(46, 44, 44)",
    105: "rgb(59, 56, 56)",

    112: "rgb(150, 73, 18)",
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



    999: "rgba(9, 0, 37, 1)",
    BagSlotsColor: "rgba(26, 26, 26, 0.2)"
}
const rewards = {
    "Coal": 1,
    "Iron": 3,
    "Shredstone": 7,
    "Egodite": 15
}
const ores = {
    105: "Coal",
    115: "Iron",
    510: "Shredstone",
    520: "Egodite",
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
            heading: "Jakubova Gym Taška",
            p: "Do môjho batohu sa zmestí aj 6 kameňov!",
            tier: "T4",
            price: 35
        },
        5: null
    },
    lamp: {
        2: {
            heading: "Stará sviečka",
            p: "S touto premium sviečkou by si mal vidieť lepšie v tých baniach",
            tier: "T2",
            price: 15
        },
        3: {
            heading: "Ultra Lumen 3000",
            p: "S touto baterkou určite nájdeš aj skrytý JAKUBOV KAMEŇ... nikomu o ňom nehovor",
            tier: "T3",
            price: 50
        },
        4: null
    },
    swiftPickaxe: {
        2: {
            heading: "Rýchly krompáč",
            p: "Toto špeciálne vylepšenie zrýchli tvoj krompáč o 33.5%      <- číslo som si vymyslel",
            tier: "",
            price: 30
        },
        3: null
    },
    cardio: {
        2: {
            heading: "Cardio",
            p: "Konečne si prestal skipovať cardio v gyme a oplatilo sa! + 5 reputácia a zrýchelný pohyb!",
            tier: "",
            price: 50
        },
        3: null
    },
    player: {
        pickaxe: 2,
        bag: 2,
        lamp: 2,
        swiftPickaxe: 2,
        cardio: 2,
    }
}
var player = {
    pos: {
        x: 39,
        y: 5
    },
    bag: [],
    bagSlots: 3,
    lamp: 1,
    pickStrength: 15,
    money: 0,
    cardio: false,
    swiftPickaxe: false
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
    generateWorld();
    surfaceDarkness();
    shopRender()

    // Hiding shop
    ShopElement.style.display = "none";
    
    // Setup SELL ZONES
    world[5][42].type = 3;
    world[5][43].type = 3;
    world[4][42].type = 3;
    world[4][43].type = 3;
    world[6][41].type = 999;
    world[6][42].type = 999;
    world[6][43].type = 999;
    world[6][44].type = 999;
    
    world[5][36].type = 4;
    world[5][35].type = 4;
    world[4][36].type = 4;
    world[4][35].type = 4;
    world[6][37].type = 999;
    world[6][36].type = 999;
    world[6][35].type = 999;
    world[6][34].type = 999;


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
            } else if (y > 60) {
                world[y][x].type = 33
                if (y > 62) {
                    let n = getRandomInt(1,30)
                    world[y][x].type = n == 1 ? 504 : 33
                }
                world[y][x].darkness = true
            } else if (y > 20) {
                world[y][x].type = 23
                if (y > 21) {
                    let n = getRandomInt(1,28)
                    if (n == 1) world[y][x].type = 112
                    if (y > 26) {
                        n = getRandomInt(1,190)
                        if (n == 1) world[y][x].type = 514
                    }
                }
                if (y == 60) {
                    world[y][x].type = getRandomInt(1,4) == 1 ? 23 : 33
                }
                world[y][x].darkness = true
            } else if (y > 5) {
                world[y][x].type = 13
                if (y > 7) {
                    let n = getRandomInt(1,20)
                    if (n == 1) world[y][x].type = 102
                    if (y > 9) {
                        n = getRandomInt(1,95)
                        if (n == 1) world[y][x].type = 504
                    }
                }
                if (y == 20) {
                    world[y][x].type = getRandomInt(1,4) == 1 ? 13 : 23
                }
                world[y][x].darkness = true
            } else {
                world[y][x].type = 0
                world[y][x].darkness = false
            }
            world[y][x].color = colors[world[y][x].type]
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
            if (block.darkness && block.type != 0 && !DISABLE_DARKNESS) {
                setColor("black")
            } else {
                setColor(colors[block.type])
            }
            canvas.fillRect(
                (x - startX) * TILE_SIZE,
                (y - startY) * TILE_SIZE,
                TILE_SIZE, TILE_SIZE
            );
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
    if (moved) {
        movementSpeed = player.cardio ? 0.22 : 0.3
    }
    if (dug) {
        diggingSpeed = player.swiftPickaxe ? 0.22 : 0.3
    }
    if (keys["q"]) { // Selling
        if (world[player.pos.y][player.pos.x].type != 3) return
        
        for (let i = 0; i < player.bagSlots; i++) {
            if (!!player.bag[i]) {
                player.money += parseInt(rewards[player.bag[i]]);
            }
        }
        player.bag = []
    }

    if (world[player.pos.y][player.pos.x].type == 4) {
        shopRender()
        ShopElement.style.display = "flex"
    } else {
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

    }

    for (let y of blocks) {
        for (let x of blocks) {
            try {
                world[player.pos.y + y][player.pos.x + x].darkness = false
            } catch (error) {
                continue
            }
        }
    }
};

const dig = (x,y) => {
    renderGUI()
    let target = world[y][x].type;
    if ((target > 9 && !(target > 990) && !(target % 10 == 5) && player.pickStrength >= target) || target > 100 && target < 990) {
        world[y][x].type++;
    } 
    
    if (target % 10 == 5 && target < 499 || target > 500 && target % 10 == 0) {
        if (target > 100 && target < 900 && !(player.bag.length > player.bagSlots - 1)) player.bag.push(ores[target])
            
        if (y < 21) {
            world[y][x].type = 1
        }
        if (y >= 21) {
            world[y][x].type = 2
        }
        if (y >= 61) {
            world[y][x].type = 5
        }
    }
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

Array.from(li).forEach(element => {
    element.addEventListener("click",() => {
        let attribute = element.attributes["data"].value
        let price = Shop[attribute][Shop.player[attribute]].price
        
        if (price <= player.money) {
            player.money -= price
            
            if (Shop[attribute][Shop.player[attribute] + 1] == null) {
                Shop[attribute][Shop.player[attribute]].price = "MAX"
            } else {
                Shop.player[attribute]++;
            }
            console.log(Shop);
            shopRender()
            switch (attribute) {
                case "pickaxe":
                    player.pickStrength += 10;
                    break;

                case "bag":
                    player.bagSlots++;
                    break;

                case "lamp":
                    player.lamp++;
                    break;

                case "swiftPickaxe":
                    player.swiftPickaxe = true;
                    break;

                case "cardio":
                    player.cardio = true;
                    break;
            }
        }
    }); 
});