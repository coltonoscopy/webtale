/*
 * Map generator for WebTale. Exports maps as Tiled JSON.
 */
var jf = require('jsonfile');
var path = require('path');

function generate() {
    var file = 'level.json';
    var obj = {};
    var height = randomInt(200, 210);
    var width = randomInt(200, 210);
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
        properties: {time: 1000},
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

    for (var i = 0; i < numbers.length; i++) {
        numbers[i] = randomIntInc(1, 3072);
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