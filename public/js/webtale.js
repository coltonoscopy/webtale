RemotePlayer = function(index, game, player, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.alive = true;

    this.player = game.add.sprite(x, y, 'icons');
    this.player.frame = 1985;

    this.player.anchor.setTo(0.5, 0.5);

    this.player.name = index.toString();
    game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.body.immovable = true;
    this.player.body.collideWorldBounds = true;

    this.lastPosition = {x: x, y: y};
};

RemotePlayer.prototype.update = function() {
    if (this.player.x != this.lastPosition.x || this.player.y != this.lastPosition.y) {
        this.player.play('move');
        this.player.rotation = Math.PI + game.physics.arcade.angleToXY(this.player, this.lastPosition.x,
            this.lastPosition.y);
    }
    else {
        this.player.play('stop');
    }

    this.lastPosition.x = this.player.x;
    this.lastPosition.y = this.player.y;
};

var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', {preload: preload, create: create,
    update: update, render: render}, false, false);

function preload() {
    game.load.image('earth', 'assets/light_sand.png');
    game.load.spritesheet('dude', 'assets/dude.png', 64, 64);
    game.load.spritesheet('enemy', 'assets/dude.png', 64, 64);
    game.load.spritesheet('icons', 'assets/tiles1.png', 32, 32);
    game.load.tilemap('level', 'assets/dungeon.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tiles1.png');
    game.load.image('healthHUD', 'assets/ui_upscaled_0.png');
}

var socket;

var map;
var layer;

var player;

var enemies;
var bmd;
var bmdTex;

var currentSpeed = 0;
var cursors;

var tileTypes = {
    grass: 961,
    ocean: 1226,
    desert: 848,
    forest: 878,
    mountain: 872,
    river: 1254,
    dungeon: 983,
    floor: 813,
    empty: null,
    walls: 1033
};

var minimap;
var newMap;

var healthHUD;

// game mode represents whether we're in exploration or combat mode
// 0 = exploration, 1 = combat
var gamemode = 0;

var collisionTiles = [];
var tileX, tileY;

function create() {
    socket = io('http://coltonoscopy.com:8120');

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.world.setBounds(-500, -500, 1000, 1000);

    // set a sock
    // socket.on("request map", function(data) {
    //     newMap = data;
    // });

    // socket.emit("request map");
    map = game.add.tilemap('level', 32, 32, 100, 100);
    map.addTilesetImage('tiles1', 'tiles');
    layer = map.createLayer('World1');
    layer.resizeWorld();
    layer.wrap = true;
    layer.fixedToCamera = true;
    layer.smoothed = false;
    layer.setScale(2);

    console.log('layer scaled!');

    // derive actual coordinates from tile-based coordinates
    var firstTile = grabFirstFloorTile();
    tileX = firstTile.x;
    tileY = firstTile.y;
    var startX = tileX * 64;
    var startY = tileY * 64;

    player = game.add.sprite(startX, startY, 'icons');
    player.frame = 1985;
    player.width = player.height = 64;
    // player.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
    // player.animations.add('stop', [3], 20, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.maxVelocity.setTo(400, 400);
    player.body.collideWorldBounds = true;

    collisionTiles.push(tileTypes.empty);

    enemies = [];

    player.bringToTop();
    console.log("After bringing player to top");

    healthHUD = game.add.sprite(30, game.height - 95, 'healthHUD');
    healthHUD.crop(new Phaser.Rectangle(15, 15, 216, 78));

    //
    // TODO: fix this section of the code to show minimap
    //
    // create new BitmapData the size of our tile map
    // bmd = game.add.bitmapData(map.width, map.height);

    // // for each tile in our map, set the pixel of our bmd to the right color
    // for (var i = 0; i < map.width * map.height; i++)
    // {
    //     var x = i % map.height;
    //     var y = Math.floor(i / map.height);

    //     console.log("X: " + x + ", Y: " + y);

    //     if (map.getTile(x, y, layer).index == tileTypes.grass)
    //         bmd.setPixel(x, y, 0x00, 0xFF, 0xFF, 0xFF, false);
    //     if (map.getTile(x, y, layer).index == tileTypes.ocean)
    //         bmd.setPixel(x, y, 0xFF, 0x00, 0xFF, 0xFF, false);
    // }

    // bmd.update();
    // var bmdSprite = game.add.sprite(1000, 510, bmd);
    // bmdSprite.fixedToCamera = true;
    // bmdSprite.bringToTop();

    game.camera.follow(player);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    var movement = 64;

    cursors.left.onDown.add(function() {
        var move = true;

        collisionTiles.forEach(function(element, index, array) {
            var tile = map.getTile(tileX - 1, tileY, layer);
            if (tile !== null)
            {
                if (element === tile.index)
                {
                    move = false;
                }
            }
            else {
                move = false;
            }
        });

        if (move && player.x % movement === 0 && tileX - 1 >= 0)
        {
            tileX -= 1;
            player.x = tileX * movement;
            game.add.tween(player).from({x: player.x + movement}, 100, Phaser.Easing.Linear.None, true);
        }
    });

    cursors.right.onDown.add(function() {
        var move = true;
        console.log('Trying to move right!');

        collisionTiles.forEach(function(element, index, array) {
            var tile = map.getTile(tileX + 1, tileY, layer);
            if (tile !== null)
            {
                if (element === tile.index)
                {
                    move = false;
                }
            }
            else {
                move = false;
            }
        });

        if (move && player.x % movement === 0 && tileX < map.width)
        {
            tileX += 1;
            player.x = tileX * movement;
            game.add.tween(player).from({x: player.x - movement}, 100, Phaser.Easing.Linear.None, true);
        }
    });

    cursors.up.onDown.add(function() {
        var move = true;

        collisionTiles.forEach(function(element, index, array) {
            var tile = map.getTile(tileX, tileY - 1, layer);
            if (tile !== null)
            {
                if (element === tile.index)
                {
                    move = false;
                }
            }
            else {
                move = false;
            }
        });

        if (move && player.y % movement === 0 && tileY >= 0)
        {
            tileY -= 1;
            player.y = tileY * movement;
            game.add.tween(player).from({y: player.y + movement}, 100, Phaser.Easing.Linear.None, true);
        }
    });

    cursors.down.onDown.add(function() {
        var move = true;

        collisionTiles.forEach(function(element, index, array) {
            var tile = map.getTile(tileX, tileY + 1, layer);
            if (tile !== null)
            {
                if (element === tile.index)
                {
                    move = false;
                }
            }
            else {
                move = false;
            }
        });

        if (move && player.y % movement === 0 && tileY < map.height)
        {
            tileY += 1;
            player.y = tileY * movement;
            game.add.tween(player).from({y: player.y - movement}, 100, Phaser.Easing.Linear.None, true);
        }
    });

    setEventHandlers();
}

var grabFirstFloorTile = function() {
    for (var i = 0; i < map.width * map.height; i++) {
        console.log("X: " + i % map.height + ", Y: " + Math.floor(i / map.height));
        if (map.getTile(i % map.height, Math.floor(i / map.height)) !== null)
        {
            if (map.getTile(i % map.height, Math.floor(i / map.height)).index === tileTypes.floor)
                return {x: i % map.height, y: Math.floor(i / map.height)};
        }
    }
    return {x: 0, y: 0};
};

var setEventHandlers = function() {
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
};

function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", {x: player.x, y:player.y});
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

function onNewPlayer(data) {
    console.log("New player connected: " + data.id);

    enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y));
}

function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: " + data.id);
        return;
    }

    movePlayer.player.x = data.x;
    movePlayer.player.y = data.y;
}

function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    }

    removePlayer.player.kill();

    enemies.splice(enemies.indexOf(removePlayer), 1);
}

/**
 * Update our game world, operating differently depending on whether we're in Exploration or
 * Combat mode as well.
 */
function update() {
    // if we're in exploration mode...
    if (gamemode === 0) {
        game.physics.arcade.collide(player, layer);

        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i].alive) {
                enemies[i].update();
                game.physics.arcade.collide(player, enemies[i].player);
            }
        }

        layer.x = -game.camera.x;
        layer.y = -game.camera.y;

        socket.emit("move player", {x: player.x, y: player.y});
    }
    else {

    }
}

function render() {

}

function playerById(id) {
    var i;
    for (i = 0; i < enemies.length; i++) {
        if (enemies[i].player.name == id)
            return enemies[i];
    }

    return false;
}