var util = require("util");
var io = require("socket.io")({
    'transports': ['websocket']
});
var jf = require('jsonfile');
var Player = require("./Player").Player;
var DungeonGenerator = require('./dungeongen.js').DungeonGenerator;

var socket,
    players,
    world;

function init() {
    players = [];
    var dunGen = new DungeonGenerator();
    var obj = dunGen.generate(100);
    var file = 'public/assets/dungeon.json';

    jf.writeFile(file, obj, function(err) {
        console.log(err);
    });

    socket = io.listen(8120);

    setEventHandlers();
}

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

    var i, existingPlayer;

    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
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
    var generator = new WorldGenerator();
    var map = generator.generate(200, 200);
    this.broadcast.emit("change map", map);
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

init();