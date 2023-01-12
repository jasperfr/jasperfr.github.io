/*
    Simple Vector2 library
    Copyright (C) 2022 jasperfr

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Simple Vector2 library.
 * 
 * @module math-vector2
 */
 (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['vector2'], factory);
    } else {
        root.vec2 = factory();
    }
}(this, function() {
    "use strict";

    /**
     * An array or typed array with 3 values.
     * @typedef {number[]|TypedArray} Vector3
     * @memberOf module:math-vector3
     */

    /**
     * Creates a new Vector3.
     * @param {Number} x 
     * @param {Number} y 
     * @return {Vector3}
     * @memberOf module:math-vector3
     */
    function create(x, y) {
        let vector = new Float32Array(2); 
        vector[0] = x;
        vector[1] = y;
        return vector;
    }

    function copy(src, dst) {
        dst = dst || new Float32Array(2);
        dst[0] = src[0];
        dst[1] = src[1];
        return dst;
    }

    /**
     * Adds 2 Vector3s.
     * @param {Vector3} a a
     * @param {Vector3|Number} b b, can be Vector3 or Number
     * @param {Vector3} dst optional Vector3 to store result.
     * @returns {Vector3} dst or Vector3 if not provided
     * @memberOf module:math-vector3
     */
    function add(a, b, dst) {
        b = typeof b === 'number' ? vec2.create(b, b) : b;
        dst = dst || new Float32Array(2);
        dst[0] = a[0] + b[0];
        dst[1] = a[1] + b[1];
        return dst;
    }

    /**
     * Substracts 2 Vector3s.
     * @param {Vector3} a a
     * @param {Vector3|Number} b b, can be Vector3 or Number
     * @param {Vector3} dst optional Vector3 to store result.
     * @returns {Vector3} dst or Vector3 if not provided
     * @memberOf module:math-vector3
     */
    function sub(a, b, dst) {
        b = typeof b === 'number' ? vec2.create(b, b) : b;
        dst = dst || new Float32Array(2);
        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        return dst;
    }

    /**
     * Multiplies 2 Vector3s.
     * @param {Vector3} a a
     * @param {Vector3|Number} b b, can be Vector3 or Number
     * @param {Vector3} dst optional Vector3 to store result.
     * @returns {Vector3} dst or Vector3 if not provided
     * @memberOf module:math-vector3
     */
    function mul(a, b, dst) {
        b = typeof b === 'number' ? vec2.create(b, b) : b;
        dst = dst || new Float32Array(2);
        dst[0] = a[0] * b[0];
        dst[1] = a[1] * b[1];
        return dst;
    }

    /**
     * Divides 2 Vector3s.
     * @param {Vector3} a a
     * @param {Vector3|Number} b b, can be Vector3 or Number
     * @param {Vector3} dst optional Vector3 to store result.
     * @returns {Vector3} dst or Vector3 if not provided
     * @memberOf module:math-vector3
     */
    function div(a, b, dst) {
        b = typeof b === 'number' ? vec2.create(b, b) : b;
        dst = dst || new Float32Array(2);
        dst[0] = a[0] / b[0];
        dst[1] = a[1] / b[1];
        return dst;
    }

    /**
     * Gets the length of a vector.
     * @param {Vector3} v vector to get the length of
     * @returns {Number} length of the vector
     * @memberOf module:math-vector3
     */
    function length(v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    }

    function lengthSquared(v) {
        return v[0] * v[0] + v[1] * v[1];
    }

    /**
     * Normalizes a vector.
     * @param {Vector3} v vector to normalize
     * @param {Vector3} dst optional Vector3 to store result.
     * @returns {Vector3} dst or Vector3 if not provided
     * @memberOf module:math-vector3
     */
    function normalize(v, dst) {
        dst = dst || new Float32Array(3);
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        const bias = 0.000001;
        if(length > bias) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
        }
        return dst;
    }

    /**
     * Gets the cross product of 2 Vectors.
     * @param {Vector3} a a
     * @param {Vector3} b b
     * @param {Vector3} dst optional Vector3 to store result.
     * @returns {Vector3} dst or Vector3 if not provided
     * @memberOf module:math-vector3
     */
    function cross(a, b, dst) {

    }
    /**
     * Gets the dot product of 2 Vector3s.
     * @param {Vector3} a a
     * @param {Vector3} b b
     * @return {number} dot product
     * @memberOf module:math-vector3
     */
    function dot(a, b) {
      return (a[0] * b[0]) + (a[1] * b[1]);
    }

    /**
     * Gets the distance between 2 vectors
     * @param {Vector3} a
     * @param {Vector3} b
     * @return {number} distance between a and b
     * @memberOf module:math-vector3
     */
    function distance(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Gets the squared distance between 2 vectors
     * @param {Vector3} a
     * @param {Vector3} b
     * @return {number} squared distance between a and b
     * @memberOf module:math-vector3
     */
    function distanceSquared(a, b) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return dx * dx + dy * dy;
    }

    function min(a, b, dst) {
        dst = dst || new Float32Array(2);
        if(a[0] == 0 && a[1] == 0) return dst;
        if(vec2.length(a) < b) {
            const truncated = vec2.normalize(a);
            vec2.multiply(truncated, b, dst);
            return dst;
        }
        return dst;
    }

    function max(a, b, dst) {
        dst = dst || new Float32Array(2);
        if(a[0] == 0 && a[1] == 0) return dst;
        if(vec2.length(a) > b ** 2) {
            const truncated = vec2.normalize(a);
            vec2.multiply(truncated, b, dst);
            return dst;
        }
        return dst;
    }

    return {
        create: create,
        copy: copy,
        clone: copy,
        add: add,
        plus: add,
        sub: sub,
        substract: sub,
        minus: sub,
        mul: mul,
        multiply: mul,
        times: mul,
        div: div,
        divide: div,
        normalize: normalize,
        length: length,
        lengthSquared: lengthSquared,
        cross: cross,
        dot: dot,
        distance: distance,
        distanceSquared: distanceSquared,
        min: min,
        max: max
    };
}));
