class Hyperdecimal {
    constructor(number, maxdepth = 0) {
        this.exponent = 0;
        if(maxdepth < 2) {
            this.exponent = new Hyperdecimal(Math.floor(Math.log10(number)), maxdepth + 1);
            this.mantissa = number / Math.pow(10, Math.floor(Math.log10(number)));
        } else {
            this.exponent = Math.floor(Math.log10(number));
            this.mantissa = number / Math.pow(10, this.exponent);
        }
    }

    // Add a hyperdecimal to this hyperdecimal
    add(other) {
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

    toString() {
        this.update();
        return `${this.mantissa.toFixed(3)}e${this.exponent.toString()}`;
    }

    update() {
        while(this.mantissa > 10) {
            this.mantissa /= 10;
            this.exponent++;
        }
        while(this.mantissa < 1) {
            this.mantissa *= 10;
            this.exponent--;
        }
    }

}

a = new Hyperdecimal(1.23e120); // would translate to: 1.23e1.2e2 aka 1.23 x10^ 1.2 x10^ 2
b = new Hyperdecimal(5e10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
console.log(a.toString());