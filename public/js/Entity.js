/**
 * An Entity is anything in the game world that can move, be it an NPC, a Player, or a Monster.
 */

function Entity(startX, startY) {
    // the tiles in our level grid at which this entity will be spawned (exact coordinates calculated by game)
    var x = startX, y = startY;

    // what our game engine will reference this entity by when deciding to render it
    var imageId;

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

    return {
        x: x,
        y: y,
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        imageId: imageId
    };
}

exports.Entity = Entity;