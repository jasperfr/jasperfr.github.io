/**
 * Exadecimal - by jasperfr
 * About Ω↑...↑Ω times bigger than ExpantaNum.
 * 
 * The absolute log10 of "infinity" is 308.2547155599167.
 *   308.2547155599167                        308
 * 10                   = 1.797693134862315*10      .
 * 
 * e308.2547155599167 is the maximum!!!
 * 1.797693134862e308 is the maximum floating point number
 * javascript can handle before shitting itself at the log10 function.
 */

const is = {
    number(val) {
        return typeof val === 'number';
    },

    string(val) {
        return typeof val === 'string';
    },

    exadecimal(val) {
        return val instanceof Exadecimal;
    },

    object(val) {
        return val === Object(val);
    }
};

class Exadecimal {
    constructor(number) {

        if(typeof number == 'string') {
            let __part = number.split('e');
            if(__part.length > 3) throw 'Exadecimal does not support up to x(E3)y... yet!'
            if(__part.length == 3) {
                this.mantissa = parseFloat(__part[0]);
                let e = parseFloat((__part[1] || '1') + 'e' + __part[2]);
                this.exponent = e == Number.POSITIVE_INFINITY ? 1.797693134862e308 : e
            } else {
                this.mantissa = parseFloat(__part[0]);
                this.exponent = parseFloat(__part[1]);
            }
        } else if(typeof number == 'object') {
            this.exponent = number.exponent;
            this.mantissa = number.mantissa;
        } else if (number === 0) {
            this.exponent = 0;
            this.mantissa = 0;
        } else {
            this.exponent = Math.floor(Math.log10(number));
            this.mantissa = number / Math.pow(10, this.exponent);
        }
    }

    static __add(a, b) {
        let c = new Exadecimal(0);
        c.add(a);
        c.add(b);
        return c;
    }

    static __sub(a, b) {
        let c = new Exadecimal(0);
        c.add(a);
        c.substract(b);
        return c;
    }

    static __mul(a, b) {
        let c = new Exadecimal(0);
        c.add(a);
        c.multiply(b);
        return c;
    }

    static __div(a, b) {
        let c = a.copy();
        c.divide(b);
        return c;
    }

    // Mantissa % 2 == 0 is even regardless of exponent.
    static __isEven(a) {
        return a.mantissa % 2 == 0;
    }

    static __round(a) {
        let c = a.copy();
        if(c.exponent < 0) return new Exadecimal(0);
        c.mantissa = parseInt(c.mantissa);
        return c;
    }

    copy() {
        return new Exadecimal({
            exponent: this.exponent,
            mantissa: this.mantissa
        });
    }

    equals(number) {
        if(!is.exadecimal(number)) {
            number = new Exadecimal(number);
        }
        if(this.mantissa == 0 && number.mantissa == 0) return true;
        else return (
            this.exponent == number.exponent &&
            this.mantissa == number.mantissa
        );
    }

    isSmallerThan(other, orEqualTo = false) {
        if(!is.exadecimal(other)) {
            other = new Exadecimal(other);
        }
        if(orEqualTo && this.exponent == other.exponent && this.mantissa == other.mantissa) return true;
        if(this.exponent < other.exponent) return true;
        else if(this.exponent == other.exponent && this.mantissa < other.mantissa) return true;
        return false;
    }

    isLargerThan(other, orEqualTo = false) {
        if(!is.exadecimal(other)) {
            other = new Exadecimal(other);
        }
        if(orEqualTo && this.exponent == other.exponent && this.mantissa == other.mantissa) return true;
        if(this.exponent > other.exponent) return true;
        else if(this.exponent == other.exponent && this.mantissa > other.mantissa) return true;
        return false;
    }

    set(other) {
        if(!is.exadecimal(other)) {
            other = new Exadecimal(other);
        }
        this.exponent = other.exponent;
        this.mantissa = other.mantissa;
    }

    /**
     * Adds another Exadecimal to this Exadecimal.
     * @param {Exadecimal} other 
     */
    add(other) {
        if(!is.exadecimal(other)) {
            other = new Exadecimal(other);
        }

        let deltaExponent = Math.abs(this.exponent - other.exponent);
        let accumulator;

        if(this.exponent > other.exponent) {
            accumulator = other.mantissa * Math.pow(10, -deltaExponent);
            this.mantissa += accumulator;
        } else if(this.exponent < other.exponent) {
            accumulator = this.mantissa * Math.pow(10, -deltaExponent);
            this.mantissa = other.mantissa + accumulator;
            this.exponent = other.exponent;
        } else {
            this.mantissa += other.mantissa;
        }
        this.update();
    }

    substract(other) {
        if(!is.exadecimal(other)) {
            other = new Exadecimal(other);
        }

        let deltaExponent = Math.abs(this.exponent - other.exponent);
        let accumulator;

        if(this.exponent > other.exponent) {
            accumulator = other.mantissa * Math.pow(10, -deltaExponent);
            this.mantissa -= accumulator;
        } else if(this.exponent < other.exponent) {
            accumulator = this.mantissa * Math.pow(10, -deltaExponent);
            this.mantissa = accumulator - other.mantissa;
            this.exponent = other.exponent;
        } else {
            this.mantissa -= other.mantissa;
        }
        this.update();
    }

    multiply(other) {
        if(!is.exadecimal(other)) {
            other = new Exadecimal(other);
        }

        this.exponent += other.exponent;
        this.mantissa *= other.mantissa;
        this.update();
    }

    divide(other) {
        if(!is.exadecimal(other)) {
            other = new Exadecimal(other);
        }

        this.exponent -= other.exponent;
        this.mantissa /= other.mantissa;
        this.update();
    }

    // WHAT???!!!?!
    static __pow(x, y) {
        return Exadecimal.__div(new Exadecimal(1), Exadecimal.___pow(x, y));
    }

    static ___pow(x, y) {
        if(!is.exadecimal(x)) x = new Exadecimal(x);
        if(!is.exadecimal(y)) y = new Exadecimal(y);
        var temp;
        if(y.equals(0)) return new Exadecimal(1);
        temp = Exadecimal.___pow(x, Exadecimal.__round(Exadecimal.__div(y, 2)));
        if(Exadecimal.__isEven(y)) return Exadecimal.__mul(temp, temp);
        else if(y.isLargerThan(0)) return Exadecimal.__mul(x, Exadecimal.__mul(temp, temp));
        else return Exadecimal.__div(Exadecimal.__mul(temp, temp), x);
    }

    toString(ee = false) {
        this.update();
        if(this.exponent == Infinity || isNaN(this.mantissa)) {
            return '∞';
        }
        if(this.exponent < 2) {
            let num = (this.mantissa * Math.pow(10, this.exponent));
            return Number.isInteger(num) ? num : num.toFixed(1);
        } else if(this.exponent < 1e3) {
            return `${this.mantissa.toFixed(1)}×10<sup>${this.exponent.toString()}</sup>`;
        } else {
            return `${this.mantissa.toFixed(2)}×10<sup>10<sup>${Math.log10(this.exponent).toFixed(2)}</sup></sup>`;
        }
    }

    update() {
        if(this.mantissa == 0) {
            return;
        }
        while(this.mantissa >= 10) {
            this.mantissa /= 10;
            this.exponent++;
        }
        while(this.mantissa < 1) {
            this.mantissa *= 10;
            this.exponent--;
        }
    }

    toSmallNumber() {
        if(this.exponent < 0) {
            return parseFloat(this.mantissa + 'e' + this.exponent);
        } else {
            return parseFloat(this.mantissa + 'e+' + this.exponent);
        }
    }

}