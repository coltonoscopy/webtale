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

/**
 * Goes through an ability's makeup and performs everything described within.
 */
function useAbility(user, ability) {
    var i;
    var attackData = {};

    // first, check if any conditions must be met to use ability
    if (ability.requires) {
        for (i in ability.requires) {
            if (i === "hasGrab") {

            }
        }
    }

    switch (ability.type) {
        case "melee":
            break;
        case "close":
            break;
        case "ranged":
            break;
        case "mount":
            break;
    }

    if (ability.blast) {

    }
    if (ability.burst) {
        if (ability.burstMax) {

        }
    }
    if (ability.chainDamage) {

    }
    if (ability.extraDamage) {

    }
    if (ability.recharge) {

    }

    // calculate effects
    if (ability.effects) {
        for (i = 0; i < ability.effects.length; i++) {
            switch (ability.effects[i].type) {
                case "buff":
                    if (ability.effects[i].category) {

                    }
                    break;
                case "dot":
                    if (ability.effects[i].duration) {

                    }
                    if (ability.effects[i].durations) {

                    }
                    break;
                case "grab":
                    break;
                case "pull":
                    break;
                case "reuse":
                    break;
                case "shift":
                    break;
                case "slow":
                    break;
            }
        }
    }

    // create an animation object for each animation that will play when ability is used
    if (ability.animations) {
        for (i = 0; i < ability.animations.length; i++) {

        }
    }

    inflict(attackData);
}

/**
 * Inflicts damage on a target from a given target.
 */
function inflict(data) {
    var totalDamage = damage;

    // account for elemental damage
    if (data.damageType !== "normal") {
        totalDamage -= totalDamage * target.resistances.damageType;
    }
}