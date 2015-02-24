/**
 * A Creature is any living thing in the game (e.g., players, monsters, NPCs, etc.).
 */

Creature.prototype = new Entity();
Creature.prototype.constructor = Creature;

function Creature(x, y) {
    // the Creature's collection of abilities
    var abilities = [];
}

exports.Creature = Creature;