/**
 * Math object extender functions
 */

/**
 * Converts degrees to radians.
 * @param {number} x
 * @returns {number} x in radians. 
 */
Math.radians = function(x) {
    return x * Math.PI / 180;
}

/**
 * Converts radians to degrees.
 * @param {number} x 
 * @returns {number} x in degrees. 
 */
Math.degrees = function(x) {
    return x * 180 / Math.PI;
}

/**
 * Clamps a value between a lower and higher bound.
 * @param {number} x number to clamp
 * @param {number} a Lower bound value
 * @param {number} b Higher bound value
 * @returns 
 */
Math.clamp = function(x, a = 0, b = Number.POSITIVE_INFINITY) {
    return Math.max(a, Math.min(x, b));
}

/**
 * Checks whether a number is a power of 2.
 * @param {number} x number to check
 */
Math.isPowerOf2 = function(x) {
    return (x & (x - 1)) == 0;
}
