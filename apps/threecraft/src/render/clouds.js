const renderClouds = function(scene) {
    const cloudGeometry = new THREE.PlaneBufferGeometry(3200,3200,1,1);
    cloudGeometry.rotateX( - Math.PI / 2);

    const cloudTexture = new THREE.TextureLoader().load('public/img/clouds.png');
    cloudTexture.magFilter = THREE.NearestFilter;

    var cloudMaterial = new THREE.MeshBasicMaterial({map: cloudTexture, transparent: true, opacity: 0.7, side: THREE.BackSide});
    
    var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.position.x = 152;
    cloudMesh.position.y = 300;
    cloudMesh.position.z = 152;

    scene.add(cloudMesh);
}
