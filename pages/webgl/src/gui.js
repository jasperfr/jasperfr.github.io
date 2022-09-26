const gui = {
    initialize(gl) {
        const shaderInfo = webglUtils.createProgramInfo(gl, ['gui-vtx', 'gui-frg']);
        const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
            position: { numComponents: 2, data: [
                0, 0,
                0, 1,
                1, 0,
                1, 0,
                0, 1,
                1, 1,
            ] },
            texcoord: [
                0, 0,
                0, 1,
                1, 0,
                1, 0,
                0, 1,
                1, 1
            ]
        });
        
        this.drawImage = function(texture, x, y, width, height, brightness = 1.0, opacity = 1.0) {
            gl.useProgram(shaderInfo.program);

            let matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
            matrix = m4.translate(matrix, x, y, 0);
            matrix = m4.scale(matrix, width, height, 1);

            webglUtils.setUniforms(shaderInfo, {
                u_matrix: matrix,
                u_texture: texture,
                u_brightness: brightness,
                u_opacity: opacity
            });

            webglUtils.setBuffersAndAttributes(gl, shaderInfo, bufferInfo);
            webglUtils.drawBufferInfo(gl, bufferInfo);
        }
    }
}
