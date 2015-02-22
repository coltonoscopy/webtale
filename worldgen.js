/**
 * Generates a world map for WebTale. For now, uses tiles off of the Dungeon Crawl Stone Soup tileset.
 */
var jf = require('jsonfile');
var path = require('path');

// IDs within the sprite sheet that map to the tiles we want to put in the map
var tileMappings = {
    grass: 961,
    ocean: 1226,
    desert: 848,
    forest: 878,
    mountain: 872,
    river: 1254,
    dungeon: 983
};

function generate() {
    var file = 'public/assets/world.json';
    var obj = {};
    var height = randomInt(1000, 1010);
    var width = randomInt(1000, 1010);
    var numbers = new Array(height * width);

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

    // first, populate map with ocean
    for (var i = 0; i < numbers.length; i++) {
        numbers[i] = tileMappings.ocean;
    }

    // make 100 random tiles in the array a specific type
    for (i = 0; i < 1000; i++)
    {
        var index = randomInt(0, height * width);
        numbers[index] = tileMappings.grass;
    }

    obj.tiles = numbers;

    jf.writeFile(file, obj, function(err) {
        console.log(err);
    });
}

function random(low, high) {
    return Math.random() * (high - low) + low;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

generate();