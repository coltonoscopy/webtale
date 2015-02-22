/*
 * Map generator for WebTale. Exports maps as Tiled JSON.
 */
var jf = require('jsonfile');
var path = require('path');

function generate() {
    var file = 'super_mario.json';
    var obj = {};
    var height = randomInt(50, 60);
    var width = randomInt(50, 60);
    var numbers = new Array(height * width);

    obj.height = height;
    obj.width = width;
    obj.orientation = 'orthogonal';
    obj.properties = {mapProp: 123};
    obj.tileheight = 16;
    obj.tilewidth = 16;
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
            image: 'super_mario.png',
            imageheight: 64,
            imagewidth: 176,
            margin: 0,
            name: 'SuperMarioBros-World1-1',
            properties: {},
            spacing: 0,
            tileheight: 16,
            tileproperties: {10: {coin: true}},
            tilewidth: 16
        }
    ];
    obj.version = 1;

    for (var i = 0; i < numbers.length; i++) {
        numbers[i] = randomIntInc(1, 11);
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