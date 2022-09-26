/*
    Simple Texture library
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
 * Simple Shader library.
 * 
 * @module webgl-texture
 */
 (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['texture'], factory);
    } else {
        root.texture = factory();
    }
}(this, function() {
    "use strict";

    /**
     * Create an empty texture.
     * @param {GL} gl 
     * @param {Number} targetWidth 
     * @param {Number} targetHeight 
     * @returns {Number} Texture ID
     */
    function createEmptyTexture(gl, targetWidth = 256, targetHeight = 256) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, targetWidth, targetHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    function createCheckerboardTexture(gl) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 8, 8, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([
                0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc,
                0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff,
                0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc,
                0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff,
                0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc,
                0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff,
                0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc,
                0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff, 0xcc, 0xff
            ]));
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    function loadCubeMapFromURL(gl, px, nx, py, ny, pz, nz) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            const faceInfos = [
                { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: px },
                { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: nx },
                { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: py },
                { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: ny },
                { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: pz },
                { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: nz }
            ];
            faceInfos.forEach(face => {
                const { target, url } = face;
                gl.texImage2D(target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
                const image = new Image();
                image.src = url;
                image.onload = function() {
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                    gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                }
            });
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return texture;
    }

    function loadFromURL(gl, url) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
            const image = new Image();
            image.src = url;
            image.addEventListener('load', function() {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                if(Math.isPowerOf2(image.width) && Math.isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                }
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.bindTexture(gl.TEXTURE_2D, null);
            });
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    return {
        createEmptyTexture,
        createCheckerboardTexture,
        loadCubeMapFromURL,
        loadFromURL
    }
}));
