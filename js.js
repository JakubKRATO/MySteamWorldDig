const startButton = document.getElementsByTagName("button")[0];
const game = document.getElementsByTagName("canvas")[0];
const canvas = game.getContext("2d");

const MAX_X = 120;
const MAX_Y = 250;

const DISPLAY_X = 40;
const DISPLAY_Y = 25;

const DISABLE_DARKNESS = true
const TILE_SIZE = 32; //32x32

const res = "1280x800";
game.width  = 1280;
game.height = 800;

var world = [];
var colors = {
    0: "white",
    1: "rgb(75, 39, 22)",
    2: "rgb(69, 79, 89)",
    3: "orange",
    13: "sienna",
    14: "saddlebrown",
    15: "maroon",
    23: "slategray",
    24: "darkgray",
    102: "rgb(28, 28, 28)",
    103: "rgb(40, 39, 39)",
    104: "rgb(46, 44, 44)",
    105: "rgb(59, 56, 56)",
    999: "red",
    BagSlotsColor: "rgba(26, 26, 26, 0.2)"
}
const rewards = {
    "Coal": 1
}

var cameraX = 0;
var cameraY = 0;
var moveCooldown = 0.5;
var keys = {}

var player = {
    pos: {
        x: 60,
        y: 5
    },
    bag: [],
    bagSlots: 5,
    money: 0
}

const main = () => {
    startButton.style.display = "none";
    game.requestFullscreen();
    generateWorld();
    setDarkness();

    // Setup SELL ZONES
    world[5][62].type = 3;
    world[5][63].type = 3;
    world[4][62].type = 3;
    world[4][63].type = 3;
    world[6][62].type = 999;
    world[6][63].type = 999;

    // Main game loop runs here (30 FPS)
    setInterval(() => {
        updatePlayer()
        renderWorld()
        setDarkness()
        renderGUI()
        moveCooldown -= 0.033; // 33ms = 0.033s
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
            } else if (y > 20) {
                world[y][x].type = 23
                world[y][x].darkness = true
            } else if (y > 5) {
                world[y][x].type = 13
                if (y > 7) {
                    let n = getRandomInt(1,22)
                    if (n == 1) world[y][x].type = 102
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
    if (moveCooldown > 0) return
    world[player.pos.y + 1][player.pos.x - 1].darkness = false
    world[player.pos.y + 1][player.pos.x + 1].darkness = false
    world[player.pos.y - 1][player.pos.x + 1].darkness = false
    world[player.pos.y - 1][player.pos.x - 1].darkness = false
    
    if (keys["w"]) {
        if (world[player.pos.y - 1][player.pos.x].type < 11) {
            player.pos.y--;
        }
    }
    if (keys["a"]) {
        if (world[player.pos.y][player.pos.x - 1].type < 11) {
            player.pos.x--;
        } else {
            dig(player.pos.x - 1, player.pos.y)
        }
    }
    if (keys["s"]) {
        if (world[player.pos.y + 1][player.pos.x].type < 11) {
            player.pos.y++;
        } else {
            dig(player.pos.x, player.pos.y + 1);
        }
    }
    if (keys["d"]) {
        if (world[player.pos.y][player.pos.x + 1].type < 11) {
            player.pos.x++;
        } else {
            dig(player.pos.x + 1, player.pos.y);
        }
    }

    if (keys["q"]) { // Selling
        if (world[player.pos.y][player.pos.x].type != 3) return

        for (let i = 0; i < player.bagSlots; i++) {
            if (!!player.bag[i]) {
                player.money += parseInt(rewards[player.bag[i]]);
                console.log(player.money);
            }
        }
        player.bag = []
    }

    moveCooldown = 0.3;
};

const setDarkness = () => {
    for (let y = 0; y < MAX_Y; y++) {
        for (let x = 0; x < MAX_X; x++) {
            try {
                var blocksY = [world[y - 1][x].type, world[y - 2][x].type, world[y - 3][x].type]
                var blocksX = [world[y][x - 1].type, world[y][x - 2].type, world[y][x + 1].type, world[y][x + 2].type]
            } catch (error) {
                continue
            }
            
            for (let i = 0; i < 2; i++) {             
                if (blocksY.includes(i) || blocksX.includes(i)) {
                    world[y][x].darkness = false
                }
            }
        }
    }
};

const setColor = (color) => {
    canvas.fillStyle = color
};
const dig = (x,y) => {
    renderGUI()
    let target = world[y][x].type;
    if (target > 9 && !(target % 10 == 5)) {
        world[y][x].type++;
    } 

    if (target % 10 == 5) {
        if (target == 105 && !(player.bag.length > player.bagSlots - 1)) player.bag.push("Coal")

        if (y < 21) {
            world[y][x].type = 1
        }
        if (y >= 21) {
            world[y][x].type = 2
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