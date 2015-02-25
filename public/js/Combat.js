/**
 * Used to simulate combat that takes place in the game.
 */

// the parties engaged in combat
var playerParty;
var enemyParty;

var playersDead, enemiesDead;

playersDead = groupAlive(playerParty);
enemiesDead = groupAlive(enemyParty);

// as long as both sides are alive, keep simulating combat
while (!playersDead && !enemiesDead) {
    playersDead = groupAlive(playerParty);
    enemiesDead = groupAlive(enemyParty);

    
}

/**
 * Checks whether a collection of Entities is dead or alive.
 */
function groupAlive(entities) {
    entitiesDead = true;
    
    playerParty.some(function(element, index, array) {
        if (element.hp !== 0) {
            entitiesDead = false;
            return true;
        }
    });

    return entitiesDead;
}