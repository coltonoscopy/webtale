HeightMapGenerator = require('./canvasTerrain.js').generateTerrainMap;

var arr2D = HeightMapGenerator(50, 1, 1);

console.log(arr2D);