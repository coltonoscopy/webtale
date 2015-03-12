var util = require("util");
var io = require("socket.io")({
    'transports': ['websocket']
});
var jf = require('jsonfile');
var Player = require("./Player").Player;
var Monster = require("./Monster").Monster;
var DungeonGenerator = require('./rotdungeon.js').DungeonGenerator;

var socket,
    players,
    monsters,
    world,
    openTiles,
    obj,
    width,
    height,
    monsterCounter;     // used to assign identifiers to all spawned monsters

var FLOOR = 813;
width = height = 64;

function init() {
    players = [];
    monsters = [];
    monsterCounter = 0;

    var dunGen = new DungeonGenerator();
    obj = dunGen.generate(width, height);

    socket = io.listen(8120);

    setEventHandlers();

    setInterval(spawnMonster, 20000);
}

/**
 * Every 20 seconds, spawn a monster if there are less than 10 active on the map.
 */
var spawnMonster = function() {
    if (monsters.length >= 10) {
        return;
    }

    // -choose a random spot on the map from the list of floor tiles
    var tile = randomInt(0, obj.layers[0].data.length);

    while (obj.layers[0].data[tile] !== FLOOR) {
        tile = randomInt(0, obj.layers[0].data.length);
    }

    // TODO: make sure no other monsters or enemies are currently there

    // -spawn it, add to list
    var monsterX = tile % height;
    var monsterY = Math.floor(tile / height);
    var newMonster = new Monster(monsterCounter, monsterX, monsterY);
    monsters.push(newMonster);
    monsterCounter++;

    // -communicate it to all sockets
    socket.sockets.emit("new monster", {x: monsterX, y: monsterY});

    console.log("Monster " + newMonster.id + " spawned at " + monsterX + ", " + monsterY + "!");
};

var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);

    client.on("disconnect", onClientDisconnect);

    client.on("new player", onNewPlayer);

    client.on("move player", onMovePlayer);

    client.on("new map", onNewMap);

    client.on("request map", onRequestMap);
}

function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);

    var removePlayer = playerById(this.id);

    if (!removePlayer) {
        util.log("Player not found: " + this.id);
        return;
    }

    players.splice(players.indexOf(removePlayer), 1);

    this.broadcast.emit("remove player", {id: this.id});
}

function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;

    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    var i, existingPlayer, existingMonster;

    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    }

    for (i = 0; i < monsters.length; i++) {
        existingMonster = monsters[i];
        this.emit("new monster", {id: existingMonster.id, x: existingMonster.getX(), y: existingMonster.getY()});
    }

    players.push(newPlayer);
}

function onMovePlayer(data) {
    var movePlayer = playerById(this.id);

    if (!movePlayer) {
        util.log("Player not found: " + this.id);
        return;
    }

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
}

function onNewMap() {
    
}

function onRequestMap() {
    this.emit("send map", obj);
}

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            return players[i];
        }
    }

    return false;
}

var random = function(low, high) {
    return Math.random() * (high - low) + low;
};

var randomInt = function(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};

var randomIntInc = function(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
};

init();