const startButton = document.getElementsByTagName("button")[0];
const game = document.getElementsByTagName("canvas")[0];
const canvas = game.getContext("2d");

const MAX_X = 120;
const MAX_Y = 250;
const DISPLAY_X = 40;
const DISPLAY_Y = 25;

const TILE_SIZE = 32; //32x32
const res = "1280x800";

game.width  = 1280;
game.height = 800;

var world = [];
var cameraX = 0;
var cameraY = 0;
var moveCooldown = 0.5;
var keys = {}

var player = {
    pos: {
        x: 0,
        y: 5
    }
}

const main = () => {git remote add origin https://github.com/JakubKRATO/MySteamWorldDig.git
    startButton.style.display = "none";
    game.requestFullscreen();

    generateWorld();
    setInterval(() => {
        updatePlayer()
        renderWorld()
        moveCooldown -= 0.033; // 33ms = 0.033s
    }, 33); // ~30 FPS

}

const generateWorld = () => {
    for (let y = 0; y < MAX_Y; y++) {
        world.push([]);
        for (let x = 0; x < MAX_X; x++) {

            if (y > 20) {
                world[y][x] = 23
            } else if (y > 5) {
                world[y][x] = 13
            } else {
                world[y][x] = 0
            }
        }
    }
    console.log(world);
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
    var tile;

    canvas.clearRect(0, 0, game.width, game.height);

    for (let y = cameraY; y < cameraY + DISPLAY_Y; y++) {
        for (let x = cameraX; x < cameraX + DISPLAY_X; x++) {
            
            tile = world[y][x];

            if (tile == 0) setColor("white");

            if (tile == 13) setColor("sienna");
            if (tile == 14) setColor("saddlebrown")
            if (tile == 15) setColor("maroon")

            if (tile == 23) setColor("slategray");
            if (tile == 25) setColor("darkgray");                
            if (tile == 24) setColor("gray");

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
        if (world[player.pos.y - 1][player.pos.x] == 0) {
            player.pos.y--;
        }
    }
    if (keys["a"]) {
        if (world[player.pos.y][player.pos.x - 1] == 0) {
            player.pos.x--;
        } else {
            dig(player.pos.x - 1, player.pos.y)
        }
    }
    if (keys["s"]) {
        if (world[player.pos.y + 1][player.pos.x] == 0) {
            player.pos.y++;
        } else {
            dig(player.pos.x, player.pos.y + 1);
        }
    }
    if (keys["d"]) {
        if (world[player.pos.y][player.pos.x + 1] == 0) {
            player.pos.x++;
        } else {
            dig(player.pos.x + 1, player.pos.y);
        }
    }

    moveCooldown = 0.3;
};

const setColor = (color) => {
    canvas.fillStyle = color
}
const dig = (x,y) => {
    let target = world[y][x];
    if (target > 9 && !(target % 10 == 5)) {
        world[y][x]++;
    } 

    if (target % 10 == 5) {
        world[y][x] = 0;
    }
};


document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});
document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});
