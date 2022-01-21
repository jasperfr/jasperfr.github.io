// ------ x ======= y -------

Math.notBetween = function(number, x, y) {
    let midSection = (x + y) / 2;
    if(number < midSection) {
        if(x < y) {
            return Math.min(number, x);
        } else {
            return Math.min(number, y);
        }
    } else {
        if(x > y) {
            return Math.max(number, x);
        } else {
            return Math.max(number, y);
        }
    }
}

Math.inBetween = function(number, x, y) {
    if(y > x) {
        return number >= x && number <= y;
    } else {
        return number >= y && number <= x;
    }
}

const shittyGarbageCollisionFunction = (X, Z, x0, x1, z0, z1) => {
    let nextX = X;

    if(Math.inBetween(Z, z0, z1)) {
        nextX = Math.notBetween(X, x0, x1);
    }

    return nextX;
}