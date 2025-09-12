const startButton = document.getElementsByTagName("button")[0];
const game = document.getElementsByTagName("canvas")[0];
const canvas = game.getContext("2d");

const MAX_X = 120;
const MAX_Y = 250;
// const MAX_X = 40;
// const MAX_Y = 25;
const DISPLAY_X = 40;
const DISPLAY_Y = 25;

const TILE_SIZE = 32; //32x32
const res = "1280x800";
game.width  = 1280;
game.height = 800;

var world = [];
var colors = {
    0: "white",
    13: "sienna",
    14: "saddlebrown",
    15: "maroon",
    23: "slategray",
    24: "darkgray",
    999: "red"

}

var cameraX = 0;
var cameraY = 0;
var moveCooldown = 0.5;
var keys = {}

var player = {
    pos: {
        x: 5,
        y: 5
    }
}

const main = () => {
    startButton.style.display = "none";
    game.requestFullscreen();

    generateWorld();
    setInterval(() => {
        updatePlayer()
        renderWorld()
        setDarkness()
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
            if (block.darkness && block.type != 0) {
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

    if (keys["w"]) {
        if (world[player.pos.y - 1][player.pos.x].type == 0) {
            player.pos.y--;
        }
    }
    if (keys["a"]) {
        if (world[player.pos.y][player.pos.x - 1].type == 0) {
            player.pos.x--;
        } else {
            dig(player.pos.x - 1, player.pos.y)
        }
    }
    if (keys["s"]) {
        if (world[player.pos.y + 1][player.pos.x].type == 0) {
            player.pos.y++;
        } else {
            dig(player.pos.x, player.pos.y + 1);
        }
    }
    if (keys["d"]) {
        if (world[player.pos.y][player.pos.x + 1].type == 0) {
            player.pos.x++;
        } else {
            dig(player.pos.x + 1, player.pos.y);
        }
    }

    moveCooldown = 0.3;
};

const setDarkness = () => {
    for (let y = 0; y < MAX_Y; y++) {
        for (let x = 0; x < MAX_X; x++) {
            try {
                var blocksY = [world[y - 1][x].type, world[y - 2][x].type, world[y - 3][x].type]
                var blocksY = [world[y][x - 1].type, world[y - 2][x].type, world[y - 3][x].type]
            } catch (error) {
                continue
            }   
            if (!(blocksY.includes(0)) && world[y][x].type != 999 && world[y][x].type != 0) {
                world[y][x].darkness = true
            } else if (blocksY.includes(0)) {
                world[y][x].darkness = false
            }
        }
    }
};
const setColor = (color) => {
    canvas.fillStyle = color
}
const dig = (x,y) => {
    let target = world[y][x].type;
    if (target > 9 && !(target % 10 == 5)) {
        world[y][x].type++;
    } 

    if (target % 10 == 5 && target > 900) {
        world[y][x].type = 0;
    }
};


document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});
