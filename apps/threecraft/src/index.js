const $ = (e) => document.querySelector(e);

const textures = {
    STONE: ThreeUtils.loadTexture('stone'),
    COBBLESTONE: ThreeUtils.loadTexture('cobblestone'),
    PLANKS: ThreeUtils.loadTexture('planks'),
    DIRT: ThreeUtils.loadTexture('dirt'),
    GLASS: ThreeUtils.loadTexture('glass'),
    SAND: ThreeUtils.loadTexture('sand'),
    GRAVEL: ThreeUtils.loadTexture('gravel'),
    OBSIDIAN: ThreeUtils.loadTexture('obsidian'),
    BRICKS: ThreeUtils.loadTexture('bricks'),
    GRASS: ThreeUtils.loadTextures(['grass_side','grass_side','grass_top','dirt','grass_side','grass_side']),
    WOOD: ThreeUtils.loadTextures(['wood_side','wood_side','wood_top','wood_top','wood_side','wood_side']),
    BEDROCK: ThreeUtils.loadTexture('bedrock')
};

const selectors = [textures.STONE, textures.DIRT, textures.WOOD, textures.COBBLESTONE, textures.SAND, textures.GRAVEL, textures.GLASS, textures.BRICKS, textures.WOOD];
var selection = 0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x77CEFB);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 800);

const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight( 0xeeeeff, 0x333333, 0.75 );
light.position.set(0, 400, 0).normalize();
scene.add(light);

// Camera controls
const cameraControls = new THREE.PointerLockControls(camera);
scene.add(cameraControls.getObject());

cameraControls.addEventListener('lock', () => {
	instructions.style.display = 'none';
	blocker.style.display = 'none';
} );

cameraControls.addEventListener('unlock', () => {
	blocker.style.display = 'block';
	instructions.style.display = '';
} );

$('#instructions').addEventListener('click', () => {
    cameraControls.lock();
}, false);

cameraControls.getObject().translateX(100);
cameraControls.getObject().translateY(100);
cameraControls.getObject().translateZ(100);

function onDocumentMouseMove( event ) {
	event.preventDefault();
	let X = event.clientX + normalizedMouseX;
	let Y = event.clientY + normalizedMouseY;
	mouse.x = (X / window.innerWidth ) * 2 - 1;
	mouse.y = -(Y / window.innerHeight ) * 2 + 1;
}

const mouse = new THREE.Vector2();
var INTERSECTED = undefined;
const raycaster = new THREE.Raycaster();

const Player = new THREE.Mesh( new THREE.BoxGeometry( 16, 16, 16 ),  new THREE.MeshBasicMaterial( {color: 0x00ff00} ) );
scene.add(Player);

// Movement (might change later)
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var previous = null;
var prevX = 100, prevZ = 100;

const ray = new THREE.Raycaster();

cameraControls.getObject().position.y = 120;

const render = (tick) => {
    // set the delta / tick
    if(!previous) previous = tick;
    let delta = (tick - previous) / 1000;
    previous = tick;

	if(cameraControls.isLocked === true) {

        // update the controls
		let player = cameraControls.getObject();
		velocity.x -= velocity.x * 10 * delta;
		velocity.z -= velocity.z * 10 * delta;
        velocity.y -= 9.8 * 50.0 * delta;
        velocity.y = Math.max(0, velocity.y);
		direction.x = (moveLeft - moveRight);
		direction.z = (moveForward - moveBackward);
		direction.normalize();
		if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        player.translateX( velocity.x * 2 * delta );
        player.translateZ( velocity.z * 2 * delta );
        player.translateY( velocity.y * delta );
        prevX = player.position.x;
        prevZ = player.position.z;
		$('#xpos').innerHTML = `x:${player.position.x}`;	
		$('#ypos').innerHTML = `y:${player.position.y}`;
        $('#zpos').innerHTML = `z:${player.position.z}`;

        player.position.x = Math.max(-6, player.position.x);
        player.position.x = Math.min(310, player.position.x);
        player.position.z = Math.max(-6, player.position.z);
        player.position.z = Math.min(310, player.position.z);

        // render the ray caster
		raycaster.ray.origin.copy(player.position);
		raycaster.setFromCamera(mouse, camera);
		let intersections = raycaster.intersectObjects(scene.children);
        raycast(intersections);
    }

	renderer.render(scene, camera);
    requestAnimationFrame(render);
}

// MOVETO blocks.js | chunk.js
const chunk = Array(20).fill(null).map(() => Array(20).fill(null).map(() => Array(20).fill(null).map(() => 0)));
console.log(chunk);

// WARNING O(256)
function renderChunk() {
    for(let y = 0; y < 2; y++) {
        for(let x = 0; x < 20; x++) {
            for(let z = 0; z < 20; z++) {
                let cube = ThreeUtils.createBlock(textures.STONE, x * 16, y * 16, z * 16);
                cube.type = 'stone';
                scene.add(cube);
            }
        }
    }
    for(let y = 2; y < 5; y++) {
        for(let x = 0; x < 20; x++) {
            for(let z = 0; z < 20; z++) {
                let cube = ThreeUtils.createBlock(textures.DIRT, x * 16, y * 16, z * 16);
                cube.type = 'dirt';
                scene.add(cube);
            }
        }
    }
    for(let y = 5; y < 6; y++) {
        for(let x = 0; x < 20; x++) {
            for(let z = 0; z < 20; z++) {
                let cube = ThreeUtils.createBlock(textures.GRASS, x * 16, y * 16, z * 16);
                cube.type = 'grass';
                scene.add(cube);
            }
        }
    }
};

function raycast(intersections) {
	var intersection;
	if(intersections.length == 0)
		return;
	else if(Array.isArray(intersections))
		intersection = intersections[0].object;
	else
		intersection = intersections;
	if(intersection.name != "block")
		return;

	if ( INTERSECTED != intersection ) {
		if ( INTERSECTED )
			if(Array.isArray(INTERSECTED.material))
				INTERSECTED.material.map(i => i.emissive.setHex(INTERSECTED.currentHex));
			else
				INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		INTERSECTED = intersection;
		if(Array.isArray(intersection.material)) {
			INTERSECTED.currentHex = INTERSECTED.material[0].emissive.getHex();
			INTERSECTED.material.map(i => i.emissive.setHex( 0x303030 ));
		}
		else {
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0x303030 );
		}
	}
}

document.addEventListener("DOMContentLoaded", function(_event) {
    window.addEventListener('mousedown', (event) => {
        event.preventDefault();
        let intersects = raycaster.intersectObjects(scene.children);
        if(!intersects[0] || intersects[0]?.object?.name !== 'block') return;
        let target = intersects[0];
        let {x, y, z} = target.object.position;
        let c = positionToChunkIndex(x, y, z);

        if(event.button == 0) {
            chunk[c.y][c.x][c.z] = 0;
            console.warn(`[DEBUG] block (${c.x}, ${c.y}, ${c.z}) in chunk removed`);
            scene.remove(target.object);
        } else {
            switch(target.faceIndex) {
                case 0: case 1:
                    scene.add(ThreeUtils.createBlock(selectors[selection], x + 16, y, z));
                    chunk[c.y][c.x + 1][c.z] = 1;
                    console.warn(`%c[DEBUG] block (${c.x}, ${c.y}, ${c.z}) in chunk added`, 'color: green');
                    break;
                case 2: case 3:
                    scene.add(ThreeUtils.createBlock(selectors[selection], x - 16, y, z));
                    chunk[c.y][c.x - 1][c.z] = 1;
                    console.warn(`%c[DEBUG] block (${c.x}, ${c.y}, ${c.z}) in chunk added`, 'color: green');
                    break;
                case 4: case 5:
                    scene.add(ThreeUtils.createBlock(selectors[selection], x, y + 16, z));
                    chunk[c.y + 1][c.x][c.z] = 1;
                    console.warn(`%c[DEBUG] block (${c.x}, ${c.y}, ${c.z}) in chunk added`, 'color: green');
                    break;
                case 6: case 7:
                    scene.add(ThreeUtils.createBlock(selectors[selection], x, y - 16, z));
                    chunk[c.y - 1][c.x][c.z] = 1;
                    console.warn(`%c[DEBUG] block (${c.x}, ${c.y}, ${c.z}) in chunk added`, 'color: green');
                    break;
                case 8: case 9:
                    scene.add(ThreeUtils.createBlock(selectors[selection], x, y, z + 16));
                    chunk[c.y][c.x][c.z + 1] = 1;
                    console.warn(`%c[DEBUG] block (${c.x}, ${c.y}, ${c.z}) in chunk added`, 'color: green');
                    break;
                case 10: case 11:
                    scene.add(ThreeUtils.createBlock(selectors[selection], x, y, z - 16));
                    chunk[c.y][c.x][c.z - 1] = 1;
                    console.warn(`%c[DEBUG] block (${c.x}, ${c.y}, ${c.z}) in chunk added`, 'color: green');
                    break;
            }
        }
    }, false );

    window.addEventListener('keydown', (event) => {
        switch ( event.keyCode ) {
            case 49: case 50: case 51:
            case 52: case 53: case 54:
            case 55: case 56: case 57:
                selection = event.keyCode - 49;
            break;
            case 38: case 87:
                moveForward = true;
                break;
            case 37: case 65:
                moveLeft = true;
                break;
            case 40: case 83:
                moveBackward = true;
                break;
            case 39: case 68:
                moveRight = true;
                break;
            case 32:
                if ( canJump === true ) velocity.y += 150;
                canJump = false;
                break;
        }
        shift = (selection * 80);
        document.getElementById('gui_pointer').style.left = `calc(50% - 368px + ${shift}px)`;
    });

    window.addEventListener('keyup', (event) => {
        switch ( event.keyCode ) {
            case 38: case 87:
                moveForward = false;
                break;
            case 37: case 65:
                moveLeft = false;
                break;
            case 40: case 83:
                moveBackward = false;
                break;
            case 39: case 68:
                moveRight = false;
                break;
        }
    })

    renderClouds(scene);
    renderWater(scene);
    renderFloor(scene);

    renderChunk();
    render();
});
