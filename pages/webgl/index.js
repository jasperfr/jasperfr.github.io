function main() {
    // Get the canvas rendering context
    const canvas = document.querySelector('canvas#main');
    const gl = canvas.getContext('webgl', { alpha: false });
    const fov = Math.radians(60);
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1.0;
    const zFar = 2000.0;
    let elapsedTime = 0.0;
    // Create shader programs
    const pTexture = shader.createProgram(gl, 'texture-vtx', 'texture-frg');
    const pSkybox = shader.createProgram(gl, 'skybox-vtx', 'skybox-frg');
    const pColor = shader.createProgram(gl, 'color-vtx', 'color-frg');
    const pWater = shader.createProgram(gl, 'water-vtx', 'water-frg');
    // Create meshes
    const mTeapot = mesh.loadFromSource(gl, 'teapot');
    const mCube = primitives.createCubeBufferInfo(gl, 2);
    const mSphere = primitives.createSphereBufferInfo(gl);
    const mPlane = primitives.createPlaneBufferInfo(gl, 100, 100);
    // Create textures
    const tPoolTiles = texture.loadFromURL(gl, 'resources/pool_tiles.png');
    const tWaterDuDv = texture.loadFromURL(gl, 'resources/water_dudv.png');
    const tWaterNormalMap = texture.loadFromURL(gl, 'resources/water_normal.png');
    const tSkybox = texture.loadCubeMapFromURL(gl,
        'resources/skybox/3/tears_ft.jpg', 'resources/skybox/3/tears_bk.jpg', 'resources/skybox/3/tears_up.jpg',
        'resources/skybox/3/tears_dn.jpg', 'resources/skybox/3/tears_rt.jpg', 'resources/skybox/3/tears_lf.jpg'
    );
    // Create framebuffers
    const { framebuffer: fbWater, texturebuffer: fbWaterTexture, renderbuffer: fbWaterDepth } = framebuffer.createFrameBuffer(gl, 1024, true);
    // Create geometries
    const gTeapot = geometry.create();
    const gSkybox = geometry.create();
    const gPlane = geometry.create();
    const gCube = geometry.create();
    const gSphere = geometry.create();
    // Attach meshes to the geometries
    geometry.attachMesh(gCube, mCube);
    geometry.attachMesh(gSkybox, mCube);
    geometry.attachMesh(gPlane, mPlane);
    geometry.attachMesh(gTeapot, mTeapot);
    geometry.attachMesh(gSphere, mTeapot);
    // Attach uniforms to the geometries
    geometry.attachUniform(gSphere, 'u_texture', tPoolTiles);
    geometry.attachUniform(gCube, 'u_texture', tPoolTiles);
    geometry.attachUniform(gSkybox, 'u_texture', tSkybox);
    geometry.attachUniforms(gPlane, {
        u_texture: fbWaterTexture,
        u_waterDepth: fbWaterDepth,
        u_dudv: tWaterDuDv,
        u_normalMap: tWaterNormalMap,
        u_lightPosition: [1000.0, 10.0, 0.0],
        u_lightColor: [1.0, 1.0, 1.0],
        u_cameraPosition: Camera.position
    });
    // Set positions to the geometries
    geometry.setPosition(gPlane, 10, -15, 10);
    geometry.setRotation(gSkybox, 0, 0, Math.PI);
    geometry.setScale(gSkybox, -1000, -1000, -1000);
    geometry.translate(gCube, 0, -15, 0);
    geometry.scale(gCube, 10, 10, 10);

    const entities = [];

    const update = function() {
        this.velocity.y -= 0.05;
        if(this.position.y == 0.0) {
            this.bounce++;
            this.velocity.y = 2.0 - this.bounce / 5.0;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;

        this.position.y = Math.max(this.position.y, 0.0);
        if(this.position.z > 100) this.velocity.z *= -1;
        if(this.position.z < -100) this.velocity.z *= -1;
        if(this.position.x > 100) this.velocity.x *= -1;
        if(this.position.x < -100) this.velocity.x *= -1;
        
        this.velocity.x *= this.friction;
        this.velocity.z *= this.friction;
    }

    for(let i = 0; i < 1024; i++) {
        const entity = new Entity(gSphere, 0, Math.random() * 10, 0);
        entity.velocity.x = Math.random() * 10 - Math.random() * 10;
        entity.velocity.y = Math.random() * 10 - Math.random() * 10;
        entity.velocity.z = Math.random() * 10 - Math.random() * 10;
        entity.bounce = 0;
        entity.friction = 0.99;
        entity.fnUpdate = update;
        entities.push(entity);
    }

    // Render function
    function render(delta) {
        entities.forEach(e => e.update());

        // Update elapsed time
        elapsedTime = delta;
        // Set constants
        const projectionMatrix = m4.perspective(fov, aspect, zNear, zFar);
        const viewMatrix = Camera.viewMatrix;
        // Update controls
        Controls.update();
        // Resize canvas
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // Update uniforms
        geometry.attachUniform(gPlane, 'u_moveFactor', elapsedTime / 10000.0);
        // Set gl context
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // Render to frame buffer
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbWater);
                gl.viewport(0, 0, 1024, 1024);
                gl.clearColor(0, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                for(let i = 0; i < 64; i++) {
                    geometry.translate(gTeapot, Math.sin(i + elapsedTime / 1000.0) * 20.0, 10 + Math.sin(i * 4 + elapsedTime / 1000.0) * 4, Math.cos(i + elapsedTime / 1000.0) * 20.0);
                    geometry.rotate(gTeapot, elapsedTime / 1000.0, elapsedTime / 1000.0, elapsedTime / 1000.0);
                    // geometry.render(gl, gTeapot, pColor, viewMatrix, projectionMatrix);
                }
                geometry.render(gl, gSkybox, pSkybox, viewMatrix, projectionMatrix);

                geometry.translate(gCube, 0, -15, 0);
                geometry.render(gl, gCube, pTexture, viewMatrix, projectionMatrix);
                geometry.translate(gCube, 20, -15, 0);
                geometry.render(gl, gCube, pTexture, viewMatrix, projectionMatrix);
                geometry.translate(gCube, 0, -15, 20);
                geometry.render(gl, gCube, pTexture, viewMatrix, projectionMatrix);
                geometry.translate(gCube, 20, -15, 20);
                geometry.render(gl, gCube, pTexture, viewMatrix, projectionMatrix);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
        // Render to canvas buffer
        {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            for(let i = 0; i < 64; i++) {
                geometry.translate(gTeapot, Math.sin(i + elapsedTime / 1000.0) * 20.0, 10 + Math.sin(i * 4 + elapsedTime / 1000.0) * 4, Math.cos(i + elapsedTime / 1000.0) * 20.0);
                geometry.rotate(gTeapot, elapsedTime / 1000.0, elapsedTime / 1000.0, elapsedTime / 1000.0);
                // geometry.render(gl, gTeapot, pColor, viewMatrix, projectionMatrix);
            }
            for(let i = 0; i < 100; i++) {
                geometry.translate(gPlane,
                    Camera.position[0] + Math.floor(i % 10) * 100 - 500,
                    -15,
                    Camera.position[2] + Math.floor(i / 10) * 100 - 500);
                geometry.render(gl, gPlane, pWater, viewMatrix, projectionMatrix);
            }
            geometry.render(gl, gSkybox, pSkybox, viewMatrix, projectionMatrix);

            geometry.translate(gCube, 0, -15, 0);
            geometry.render(gl, gCube, pTexture, viewMatrix, projectionMatrix);
            geometry.translate(gCube, 20, -15, 0);
            geometry.render(gl, gCube, pTexture, viewMatrix, projectionMatrix);
            geometry.translate(gCube, 0, -15, 20);
            geometry.render(gl, gCube, pTexture, viewMatrix, projectionMatrix);
            geometry.translate(gCube, 20, -15, 20);
            geometry.render(gl, gCube, pTexture, viewMatrix, projectionMatrix);
            entities.forEach(e => e.render(gl, pColor, viewMatrix, projectionMatrix));
        }

        // Request new animation frame
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

document.addEventListener('DOMContentLoaded', () => main());
