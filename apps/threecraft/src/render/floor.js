const renderFloor = function(scene) {
    scene.add(ThreeUtils.createWall('bedrock', 152, -8, 152, 320, 320, (-Math.PI / 2), 0, 0, true));
    scene.add(ThreeUtils.createWall('bedrock', 152, 32, -8, 320, 80, 0, 0, 0, true));
    scene.add(ThreeUtils.createWall('bedrock', 152, 32, -8+320, 320, 80, 0, 0, 0, true));
    scene.add(ThreeUtils.createWall('bedrock', -8+320, 32, 152, 320, 80, 0, (-Math.PI/2), 0, true));
    scene.add(ThreeUtils.createWall('bedrock', -8, 32, 152, 320, 80, 0, (-Math.PI/2), 0, true));
};
