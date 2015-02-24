/**
 * Monsters are strictly used in the Combat setting, although they can fight either for or against the players.
 */

Monster.prototype = new Creature();
Monster.prototype.constructor = Monster;

/**
 * Look up the Monster in our database by ID, then plant it in the x and y position described. Also tinker a little
 * with the stats to provide some variability.
 */
function Monster(id, x, y) {
    
}