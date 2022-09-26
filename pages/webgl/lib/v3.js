/*
    Simple Vector3 library
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
 * Simple Vector3 library.
 * 
 * @module math-vector3
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['vector3'], factory);
    } else {
        root.v3 = factory();
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
     * @param {Number} z
     * @return {Vector3}
     * @memberOf module:math-vector3
     */
    function create(x, y, z) {
        let vector = new Float32Array(3); 
        vector[0] = x;
        vector[1] = y;
        vector[2] = z;
        return vector;
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
        b = typeof b === 'number' ? v3.create(b, b, b) : b;
        dst = dst || new Float32Array(3);
        dst[0] = a[0] + b[0];
        dst[1] = a[1] + b[1];
        dst[2] = a[2] + b[2];
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
        b = typeof b === 'number' ? v3.create(b, b, b) : b;
        dst = dst || new Float32Array(3);
        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        dst[2] = a[2] - b[2];
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
        b = typeof b === 'number' ? v3.create(b, b, b) : b;
        dst = dst || new Float32Array(3);
        dst[0] = a[0] * b[0];
        dst[1] = a[1] * b[1];
        dst[2] = a[2] * b[2];
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
        b = typeof b === 'number' ? v3.create(b, b, b) : b;
        dst = dst || new Float32Array(3);
        dst[0] = a[0] / b[0];
        dst[1] = a[1] / b[1];
        dst[2] = a[2] / b[2];
        return dst;
    }

    /**
     * Gets the length of a vector.
     * @param {Vector3} v vector to get the length of
     * @returns {Number} length of the vector
     * @memberOf module:math-vector3
     */
    function length(v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    }

    /**
     * Divides 2 Vector3s.
     * @param {Vector3} v vector to normalize
     * @param {Vector3} dst optional Vector3 to store result.
     * @returns {Vector3} dst or Vector3 if not provided
     * @memberOf module:math-vector3
     */
    function normalize(v, dst) {
        dst = dst || new Float32Array(3);
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        const bias = 0.000001;
        if(length > bias) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
            dst[2] = v[2] / length;
        }
        return dst;
    }

    /**
     * Gets the cross product of 2 Vector3s.
     * @param {Vector3} a a
     * @param {Vector3} b b
     * @param {Vector3} dst optional Vector3 to store result.
     * @returns {Vector3} dst or Vector3 if not provided
     * @memberOf module:math-vector3
     */
    function cross(a, b, dst) {
        dst = dst || new Float32Array(3);
        dst[0] = a[1] * b[2] - a[2] * b[1];
        dst[1] = a[2] * b[0] - a[0] * b[2];
        dst[2] = a[0] * b[1] - a[1] * b[0];
        return dst;
    }
    /**
     * Gets the dot product of 2 Vector3s.
     * @param {Vector3} a a
     * @param {Vector3} b b
     * @return {number} dot product
     * @memberOf module:math-vector3
     */
    function dot(a, b) {
      return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
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
        const dz = a[2] - b[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
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
        const dz = a[2] - b[2];
        return dx * dx + dy * dy + dz * dz;
    }

    return {
        create: create,
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
        cross: cross,
        dot: dot,
        distance: distance,
        distanceSquared: distanceSquared
    };
}));
