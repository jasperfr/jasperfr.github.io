const renderWater = function (scene) {
    const floor = new THREE.PlaneBufferGeometry(320, 320, 1, 1);
    floor.rotateX(- Math.PI / 2);

    const tex_bedrock = new THREE.TextureLoader().load('public/img/bedrock.png');
    tex_bedrock.magFilter = THREE.NearestFilter;
    tex_bedrock.wrapS = tex_bedrock.wrapT = THREE.RepeatWrapping;
    tex_bedrock.repeat.set(floor.parameters.width / 16, floor.parameters.height / 16);
    const floorMaterial = new THREE.MeshLambertMaterial({ map: tex_bedrock, blending: THREE.NoBlending });

    const tex_water = new THREE.TextureLoader().load('public/img/water.png');
    tex_water.magFilter = THREE.NearestFilter;
    tex_water.wrapS = tex_water.wrapT = THREE.RepeatWrapping;
    tex_water.repeat.set(floor.parameters.width / 16, floor.parameters.height / 16);
    const waterMaterial = new THREE.MeshBasicMaterial({ map: tex_water, transparent: true, opacity: 0.7 });

    function generateWaterChunk(x, y, z) {
        var waterChunk = new THREE.Mesh(floor, waterMaterial);
        waterChunk.position.x = -8 + x;
        waterChunk.position.y = y + 8;
        waterChunk.position.z = -8 + z;
        scene.add(waterChunk);
        var bedrockChunk = new THREE.Mesh(floor, floorMaterial);
        bedrockChunk.position.x = -8 + x;
        bedrockChunk.position.y = y;
        bedrockChunk.position.z = -8 + z;
        scene.add(bedrockChunk);
    }

    generateWaterChunk(480, 72, 480);
    generateWaterChunk(480, 72, 160);
    generateWaterChunk(480, 72, -160);
    generateWaterChunk(160, 72, 480);
    generateWaterChunk(160, 72, -160);
    generateWaterChunk(-160, 72, 480);
    generateWaterChunk(-160, 72, 160);
    generateWaterChunk(-160, 72, -160);
};
