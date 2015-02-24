/*
 * Map generator for WebTale. Returns maps with generate() as Tiled JSON.
 */

function MapGenerator() {
    var generate = function() {
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
            numbers[i] = randomIntInc(896, 920);
        }

        // make 100 random tiles in the array a specific type
        for (i = 0; i < 100; i++)
        {
            var index = randomInt(0, height * width);
            numbers[index] = 196;
        }

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

    return {
        generate: generate,
        random: random,
        randomInt: randomInt,
        randomIntInc: randomIntInc
    };
}

exports.MapGenerator = MapGenerator;