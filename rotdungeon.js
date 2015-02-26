/**
 * Random dungeon generator using Rot.js instead of the other example.
 */
var jf = require('jsonfile');
var ROT = require('./public/js/rot.js').ROT;

function DungeonGenerator() {

}

DungeonGenerator.prototype.generate = function(width, height) {
    // IDs within the sprite sheet that map to the tiles we want to put in the map
    var tileMappings = {
        floor: 813,
        empty: null,
        walls: 1033
    };

    var map = Array(width * height);

    ROT.RNG.setSeed(Math.floor(Math.random() * 123456789));

    var rotMap = new ROT.Map.Digger(width, height);
    rotMap.create(function(x, y, type) {
        console.log(type);
        if (type === 1)
            map[y * width + x] = tileMappings.empty;
        if (type === 0)
            map[y * width + x] = tileMappings.floor;
        if (type === 2)
            map[y * width + x] = tileMappings.walls;
    });

    // build walls
    // for (x = 0; x < width; x++) {
    //     for (y = 0; y < height; y++) {
    //         if (map[y * width + x] == tileMappings.floor) {
    //             for (var xx = x - 1; xx <= x + 1; xx++) {
    //                 for (var yy = y - 1; yy <= y + 1; yy++) {
    //                     if (map[width * yy + xx] == tileMappings.empty) map[width * yy + xx] = tileMappings.walls;
    //                 }
    //             }
    //         }
    //     }
    // }

    var obj = {};
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

exports.DungeonGenerator = DungeonGenerator;