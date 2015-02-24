var Player = function(startX, startY) {
    var x = startX,
        y = startY,
        id, playerClass, health, mana,
        strength, cons, dex, intel, wisdom, charisma, race;

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
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        id: id,
        playerClass: playerClass,
        health: health,
        mana: mana,
        strength: strength,
        cons: cons,
        dex: dex,
        intel: intel,
        wisdom: wisdom,
        charisma: charisma,
        race: race
    };
};

exports.Player = Player;