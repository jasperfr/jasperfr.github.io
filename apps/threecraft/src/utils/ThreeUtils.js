const ThreeUtils = (function()
{
    var loadTexture;
    var loadTextures;
    var createBlock;
    var createWall;

    // Loads a single texture.
    loadTexture = function(filename) {
        var texture = new THREE.TextureLoader().load(`public/img/${filename}.png`);
        texture.magFilter = THREE.NearestFilter;
        return texture;
    }

    // Loads multiple textures, returns an array.
    loadTextures = function(filenames) {
        var textures = [];
        for(var i = 0; i < 6; i++)
        {
            var texture = new THREE.TextureLoader().load( `public/img/${filenames[i]}.png` );
            texture.magFilter = THREE.NearestFilter;
            textures.push(texture);
        }
        return textures;
    }

    // Creates a new block.
    var blockGeometry = new THREE.BoxBufferGeometry(16, 16, 16);
    createBlock = function(textures, x, y, z) {
        var materials;
        if(Array.isArray(textures))
            materials = textures.map(texture => new THREE.MeshLambertMaterial({map: texture, blending: THREE.NoBlending, transparent: true}))
        else
            materials = new THREE.MeshLambertMaterial({map: textures, blending: THREE.NoBlending, transparent: true});
        // Create the mesh
        var cube = new THREE.Mesh(blockGeometry, materials);
        cube.name = "block";
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        return cube;
    }
    
    createWall = function(texture, x, y, z, width, height, xrot, yrot, zrot, isTiled) {
        var tex = this.loadTexture(texture);
        if(isTiled) {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(width / 16, height / 16);
        }
        let wallMaterial = new THREE.MeshLambertMaterial({map: tex, blending: THREE.NoBlending, side: THREE.DoubleSide});
        let wallGeometry = new THREE.PlaneBufferGeometry(width, height);
        wallGeometry.rotateX(xrot);
        wallGeometry.rotateY(yrot);
        wallGeometry.rotateZ(zrot);
        let wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.x = x;
        wall.position.y = y;
        wall.position.z = z;
        return wall;
    }

    return {
        loadTexture : loadTexture,
        loadTextures : loadTextures,
        createBlock : createBlock,
        createWall : createWall
    }

}());