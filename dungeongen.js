/**
 * Generates a dungeon to be used in our game.
 */
jf = require('jsonfile');

function DungeonGenerator() {
    // IDs within the sprite sheet that map to the tiles we want to put in the map
    var tileMappings = {
        floor: 813,
        empty: null,
        walls: 1033
    };

    var obj;
    var height;
    var width;
    var numbers;
    var max, min;
    this.rooms = [];
    var room;
    var mapSize;

    var generate = function(size) {
        obj = {};
        height = size;
        width = size;
        numbers = new Array(height * width);
        mapSize = size;
        
        for (var i = 0; i < height * width; i++) {
            numbers[i] = tileMappings.empty;
        }

        var roomCount = randomIntInc(10, 20);
        var minSize = 5;
        var maxSize = 15;

        for (i = 0; i < roomCount; i++) {
            room = {};

            room.x = randomInt(1, mapSize - maxSize - 1);
            room.y = randomInt(1, mapSize - maxSize - 1);
            room.w = randomInt(minSize, maxSize);
            room.h = randomInt(minSize, maxSize);

            if (DoesCollide(room)) {
                i--;
                continue;
            }

            room.w--;
            room.h--;

            rooms.push(room);
        }

        SquashRooms();

        for (i = 0; i < roomCount; i++) {
            var roomA = rooms[i];
            var roomB = FindClosestRoom(roomA);
            pointA = {
                x: randomInt(roomA.x, roomA.x + roomA.w),
                y: randomInt(roomA.y, roomA.y + roomA.h)
            };
            pointB = {
                x: randomInt(roomB.x, roomB.x + roomB.w),
                y: randomInt(roomB.y, roomB.y + roomB.h)
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

                numbers[pointB.y * height + pointB.x] = tileMappings.floor;
            }
        }

        var x, y;

        // build corridors
        for (i = 0; i < roomCount; i++) {
            var myRoom = rooms[i];

            for (x = room.x; x < room.x + room.w; x++) {
                for (y = room.y; y < room.y + room.h; y++) {
                    numbers[y * height + x] = tileMappings.floor;
                }
            }
        }

        // build walls
        for (x = 0; x < mapSize; x++) {
            for (y = 0; y < mapSize; y++) {
                if (numbers[y * height + x] == tileMappings.floor) {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            if (numbers[size * yy + xx] == tileMappings.empty) numbers[size * yy + xx] = tileMappings.walls;
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
            data: numbers,
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

        obj.tiles = numbers;

        return obj;
    };

    var random = function(low, high) {
        return Math.random() * (high - low) + low;
    };

    var randomInt = function(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    };

    var randomIntInc = function(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    };

    this.FindClosestRoom = function(room) {
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
            var distance = Math.abs(mid.x - checkMid.x) + Math.abs(mid.y - checkMid.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closest = check;
            }
        }

        return closest;
    };

    this.DoesCollide = function(room, ignore) {
        for (var i = 0; i < this.rooms.length; i++) {
            if (i == ignore) continue;
            var check = this.rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h)))
                return true;
        }

        return false;
    };

    this.SquashRooms = function() {
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

    return {
        generate: generate,
        tileMappings: tileMappings
    };
}

var gen = DungeonGenerator();
var file = 'public/assets/dungeon.json';
var obj = gen.generate(100);

jf.writeFile(file, obj, function(err) {
    console.log(err);
});