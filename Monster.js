var Monster = function(monsterId, startX, startY) {
    var x = startX,
        y = startY,
        id = monsterId,
        health, mana,
        strength, cons, dex, intel, wisdom, charisma;

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
        health: health,
        mana: mana,
        strength: strength,
        cons: cons,
        dex: dex,
        intel: intel,
        wisdom: wisdom,
        charisma: charisma
    };
};

exports.Monster = Monster;