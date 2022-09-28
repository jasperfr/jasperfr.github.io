class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(x, y) {
        y = typeof x === 'object' ? x.y : y || x;
        x = typeof x === 'object' ? x.x : x;
        this.x += x;
        this.y += y;
    }

    sub(x, y) {
        y = typeof x === 'object' ? x.y : y || x;
        x = typeof x === 'object' ? x.x : x;
        this.x -= x;
        this.y -= y;
    }

    mul(x, y) {
        y = typeof x === 'object' ? x.y : y || x;
        x = typeof x === 'object' ? x.x : x;
        this.x *= x;
        this.y *= y;
    }

    div(x, y) {
        y = typeof x === 'object' ? x.y : y || x;
        x = typeof x === 'object' ? x.x : x;
        this.x /= x;
        this.y /= y;
    }

    clamp(lo, hi) {
        this.x = Math.min(Math.max(lo, this.x), hi);
        this.y = Math.min(Math.max(lo, this.y), hi);
    }

    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    get normalized() {
        return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
    }

    get adjacent() {
        return new Vector2(this.y, -this.x);
    }
}