/*
    Simple Mesh library
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
 * Simple Mesh library.
 * 
 * @module webgl-mesh
 */
 (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['mesh'], factory);
    } else {
        root.mesh = factory();
    }
}(this, function() {
    "use strict";

    /**
     * An array or typed array with 3 values.
     * @typedef {Object} Mesh
     * @memberOf module:webgl-mesh
     */

    /**
     * Creates a primitive cube.
     * @returns {Mesh} A primitive Cube mesh.
     */
    function createPrimitiveCube(gl) {
        const output = {
            vertices: [],
            normals: [],
            indices: [],
        }

        return {
            vertices: output.vertices.flat(),
            indices: output.indices.flat(),
            normals: output.normals.flat()
        };
    }

    /**
     * Creates a new Mesh object.
     * @returns {Mesh} A loaded Mesh instance.
     */
    function loadFromSource(gl, meshSource) {
        const output = {
            position: [],
            normal: [],
            indices: [],
        }

        let src = document.getElementById(meshSource);
        meshSource = src ? src.text : meshSource;

        if(!meshSource) {
            console.error('Could not load mesh source file.');
            return output;
        }

        let lines = meshSource.split('\n');
        for(let i = 0; i < lines.length; i++) {
            if(lines[i].startsWith(' ') || lines[i].startsWith('#')) continue;
            let arr = lines[i].split(' ');
            let operand = arr.shift();
            switch(operand) {
                case 'v': output.position.push(arr.map(parseFloat)); break;
                case 'f': output.indices.push(arr.map(e => parseFloat(e) - 1)); break;
                case 'vn': output.normal.push(arr.map(parseFloat)); break;
                default: continue;
            }
        }

        const arrayBuffers = webglUtils.createBufferInfoFromArrays(gl, {
            position: new Float32Array(output.position.flat()),
            normal:  new Float32Array(output.normal.flat()),
            indices:  new Uint16Array(output.indices.flat()),
        });

        return arrayBuffers;
    }

    return {
        createPrimitiveCube,
        loadFromSource
    }
}));
