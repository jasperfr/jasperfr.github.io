const bigint = {
    mantissa: 5.612834,
    exponent: {
        mantissa: 1.27,
        exponent: {
            mantissa: 1.2,
            exponent: 2
        }
    }
}

function print(o) {
    if(typeof o.exponent == 'number') {
        return `${o.mantissa}e${o.exponent}`;
    } else {
        return `${o.mantissa}e${print(o.exponent)}`;
    }
}

console.log(print(bigint));