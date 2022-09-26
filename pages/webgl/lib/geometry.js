/**
 * Simple Geometry library.
 * 
 * @module webgl-geometry
 */
 (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['geometry'], factory);
    } else {
        root.geometry = factory();
    }
}(this, function() {
    "use strict";

    /**
     * An array or typed array with 3 values.
     * @typedef {Object} Geometry
     * @memberOf module:webgl-geometry
     */

    /**
     * An array or typed array with 3 values.
     * @typedef {Object} Mesh
     * @memberOf module:webgl-mesh
     */

    /**
     * Creates a new Geometry object.
     * @returns {Geometry} A new Geometry instance.
     */
    function create() {
        return {
            uniforms: { },
            attribs: null,
            indices: null,
            position: v3.create(0, 0, 0), 
            rotation: v3.create(0, 0, 0), 
            scaling: v3.create(1, 1, 1),
        }
    }

    /**
     * 
     * @param {Geometry} geometry 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    function setPosition(geometry, x, y, z) {
        geometry.position[0] = x;
        geometry.position[1] = y;
        geometry.position[2] = z;
    }

    /**
     * 
     * @param {Geometry} geometry 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
     function setRotation(geometry, x, y, z) {
        geometry.rotation[0] = x;
        geometry.rotation[1] = y;
        geometry.rotation[2] = z;
    }

    /**
     * 
     * @param {Geometry} geometry 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    function setScale(geometry, x, y, z) {
        geometry.scaling[0] = x;
        geometry.scaling[1] = y;
        geometry.scaling[2] = z;
    }

    /**
     * Attaches a Mesh to the Geometry object.
     * @param {Geometry} geometry 
     * @param {Mesh} mesh 
     */
    function attachMesh(geometry, mesh) {
        geometry.attribs = mesh.attribs;
        geometry.indices = mesh.indices;
        geometry.numElements = mesh.numElements;
    }

    /**
     * Attaches an attribute to the Geometry.
     * @param {String} attribute_key 
     * @param {String} attribute_value 
     * @param {Geometry} geometry 
     */
    function attachAttribute(attribute_key, attribute_value, geometry) {
        geometry.attribs[attribute_key] = attribute_value;
    }

    /**
     * Attaches multiple uniforms to the Geometry.
     * @param {String} uniform_key 
     * @param {String} uniform_value 
     * @param {Geometry} geometry 
     */
    function attachUniforms(geometry, uniforms) {
        for(let [k, v] of Object.entries(uniforms)) {
            geometry.uniforms[k] = v;
        }
    }

    /**
     * Attaches a uniform to the Geometry.
     * @param {String} uniform_key 
     * @param {String} uniform_value 
     * @param {Geometry} geometry 
     */
    function attachUniform(geometry, uniform_key, uniform_value) {
        geometry.uniforms[uniform_key] = uniform_value;
    }

    function render(gl, geometry, shader, view, projection) {
        if(view) attachUniform(geometry, 'u_view', view);
        if(projection) attachUniform(geometry, 'u_projection', projection);
        let position = m4.identity();
        m4.translate(position, geometry.position[0], geometry.position[1], geometry.position[2], position);
        m4.xRotate(position, geometry.rotation[0], position);
        m4.yRotate(position, geometry.rotation[1], position);
        m4.zRotate(position, geometry.rotation[2], position);
        m4.scale(position, geometry.scaling[0], geometry.scaling[1], geometry.scaling[2], position);
        attachUniform(geometry, 'u_world', position);

        //     m4.axisRotate(
        //         m4.scale(
        //             m4.translation(),
        //             geometry.scaling[0], geometry.scaling[1], geometry.scaling[2]
        //         ),
        //         geometry.rotation[0], geometry.rotation[1], geometry.rotation[2]
        //     )
        // )

        gl.useProgram(shader.program);
        
        webglUtils.setBuffersAndAttributes(gl, shader, geometry);
        webglUtils.setUniforms(shader, geometry.uniforms);
        webglUtils.drawBufferInfo(gl, geometry);
    }

    return {
        create,
        attachMesh,
        attachUniform,
        attachUniforms,
        attachAttribute,
        setPosition,
        setRotation,
        setScale,
        translate: setPosition,
        rotate: setRotation,
        scale: setScale,
        render
    }
}));
