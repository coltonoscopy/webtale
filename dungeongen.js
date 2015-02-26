/**
 * Generates a dungeon to be used in our game.
 */
jf = require('jsonfile');
ROT = require('./public/js/rot.js');

function DungeonGenerator() {
    this.rooms = [];
}

DungeonGenerator.prototype.generate = function(size) {
    var obj = {};
    var height = size;
    var width = size;
    var map = new Array(height * width);
    var room;
    var mapSize;
    var max, min;

    // IDs within the sprite sheet that map to the tiles we want to put in the map
    var tileMappings = {
        floor: 813,
        empty: null,
        walls: 1033
    };

    mapSize = size;
    
    for (var i = 0; i < height * width; i++) {
        map[i] = tileMappings.empty;
    }

    var roomCount = this.randomIntInc(10, 20);
    var minSize = 5;
    var maxSize = 15;

    for (i = 0; i < roomCount; i++) {
        room = {};

        room.x = this.Helpers.GetRandom(1, mapSize - maxSize - 1);
        room.y = this.Helpers.GetRandom(1, mapSize - maxSize - 1);
        room.w = this.Helpers.GetRandom(minSize, maxSize);
        room.h = this.Helpers.GetRandom(minSize, maxSize);

        if (this.DoesCollide(room)) {
            i--;
            continue;
        }

        room.w--;
        room.h--;

        this.rooms.push(room);
    }

    this.SquashRooms();

    for (i = 0; i < roomCount; i++) {
        var roomA = this.rooms[i];
        var roomB = this.FindClosestRoom(roomA);

        pointA = {
            x: this.Helpers.GetRandom(roomA.x, roomA.x + roomA.w),
            y: this.Helpers.GetRandom(roomA.y, roomA.y + roomA.h)
        };
        pointB = {
            x: this.Helpers.GetRandom(roomB.x, roomB.x + roomB.w),
            y: this.Helpers.GetRandom(roomB.y, roomB.y + roomB.h)
        };

        while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
            if (pointB.x != pointA.x) {
                if (pointB.x > pointA.x) pointB.x--;
                else pointB.x++;
            }
            else if (pointB.y != pointA.y) {
                if (pointB.y > pointA.y) pointB.y--;
                else pointB.y++;
            }

            map[pointB.y * size + pointB.x] = tileMappings.floor;
        }
    }

    var x, y;

    // build corridors
    for (i = 0; i < roomCount; i++) {
        var myRoom = this.rooms[i];

        for (x = room.x; x < room.x + room.w; x++) {
            for (y = room.y; y < room.y + room.h; y++) {
                map[y * size + x] = tileMappings.floor;
            }
        }
    }

    // build walls
    for (x = 0; x < mapSize; x++) {
        for (y = 0; y < mapSize; y++) {
            if (map[y * size + x] == tileMappings.floor) {
                for (var xx = x - 1; xx <= x + 1; xx++) {
                    for (var yy = y - 1; yy <= y + 1; yy++) {
                        if (map[size * yy + xx] == tileMappings.empty) map[size * yy + xx] = tileMappings.walls;
                    }
                }
            }
        }
    }

    obj.height = height;
    obj.width = width;
    obj.orientation = 'orthogonal';
    obj.properties = {};
    obj.tileheight = 32;
    obj.tilewidth = 32;
    obj.layers = [];
    obj.layers[0] = {
        data: map,
        height: obj.height,
        name: 'World1',
        opacity: 1,
        properties: {},
        type: 'tilelayer',
        visible: true,
        width: obj.width,
        x: 0,
        y: 0
    };
    obj.tilesets = [
        {
            firstgid: 1,
            image: 'tiles1.png',
            imageheight: 1536,
            imagewidth: 2048,
            margin: 0,
            name: 'tiles1',
            properties: {},
            spacing: 0,
            tileheight: 32,
            tileproperties: {},
            tilewidth: 32
        }
    ];
    obj.version = 1;

    obj.tiles = map;

    return obj;
};

DungeonGenerator.prototype.FindClosestRoom = function(room) {
    var mid = {
        x: room.x + (room.w / 2),
        y: room.y + (room.h / 2)
    };
    var closest = null;
    var closestDistance = 1000;
    for (var i = 0; i < this.rooms.length; i++) {
        var check = this.rooms[i];
        if (check == room) continue;
        var checkMid = {
            x: check.x + (check.w / 2),
            y: check.y + (check.h / 2)
        };
        var distance = Math.min(Math.abs(mid.x - checkMid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - checkMid.y) - (room.h / 2) - (check.h / 2));
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = check;
        }
    }

    return closest;
};

DungeonGenerator.prototype.DoesCollide = function(room, ignore) {
    for (var i = 0; i < this.rooms.length; i++) {
        if (i == ignore) continue;
        var check = this.rooms[i];
        if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h)))
            return true;
    }

    return false;
};

DungeonGenerator.prototype.SquashRooms = function() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < this.rooms.length; j++) {
            var room = this.rooms[j];
            while (true) {
                var oldPosition = {
                    x: room.x,
                    y: room.y
                };
                if (room.x > 1) room.x--;
                if (room.y > 1) room.y--;
                if ((room.x == 1) && (room.y == 1)) break;
                if (this.DoesCollide(room, j)) {
                    room.x = oldPosition.x;
                    room.y = oldPosition.y;
                    break;
                }
            }
        }
    }
};

DungeonGenerator.prototype.random = function(low, high) {
    return Math.random() * (high - low) + low;
};

DungeonGenerator.prototype.randomInt = function(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};

DungeonGenerator.prototype.randomIntInc = function(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
};

DungeonGenerator.prototype.Helpers = {
    GetRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    }
};

// var gen = DungeonGenerator();
// var file = 'public/assets/dungeon.json';
// var obj = gen.generate(100);

// jf.writeFile(file, obj, function(err) {
//     console.log(err);
// });

exports.DungeonGenerator = DungeonGenerator;