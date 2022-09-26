/*
    Simple Framebuffer library
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
 * Simple Framebuffer library.
 * 
 * @module webgl-texture
 */
 (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['framebuffer'], factory);
    } else {
        root.framebuffer = factory();
    }
}(this, function() {
    "use strict";

    function createFrameBuffer(gl, textureSize, enableRenderbuffer = true) {
        const texturebuffer = texture.createEmptyTexture(gl, textureSize, textureSize);
        const renderbuffer = gl.createRenderbuffer();
        const framebuffer = gl.createFramebuffer();
        
        if(enableRenderbuffer) gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texturebuffer, 0);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, textureSize, textureSize);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if(enableRenderbuffer) gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return {
            framebuffer,
            renderbuffer,
            texturebuffer
        }
    }

    return {
        createFrameBuffer
    }
}));
