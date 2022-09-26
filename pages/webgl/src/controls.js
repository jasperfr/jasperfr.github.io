const Controls = (function() {

    const keyStates = {};

    function initialize() {
        const canvas = document.querySelector('canvas#main');

        canvas.onclick = function() {
            canvas.requestPointerLock();
        }

        document.addEventListener('pointerlockchange', function() {
            if(document.pointerLockElement === canvas) {
                document.addEventListener('mousemove', updatePosition, false);
            } else {
                document.removeEventListener('mousemove', updatePosition, false);
            }
        }, false);    

        document.addEventListener('keydown', (e) => {
            keyStates[e.key.toLowerCase()] = true;
        });
        document.addEventListener('keyup', (e) => {
            keyStates[e.key.toLowerCase()] = false;
        });
    }
        
    function getKeyState(key) {
        return keyStates[key] || false;
    }

    function updatePosition(e) {
        Camera.yaw += e.movementX / 10;
        Camera.pitch -= e.movementY / 10;
        Camera.pitch = Math.clamp(Camera.pitch, -89.0, 89.0);
    }

    function update() {
        if(getKeyState('w')) Camera.forward();
        if(getKeyState('a')) Camera.left();
        if(getKeyState('s')) Camera.backward();
        if(getKeyState('d')) Camera.right();
        if(getKeyState(' ') && Camera.position[1] === 10.0) Camera.velocity[1] = 0.2;
        Camera.speed = getKeyState('shift') ? 0.5 : 0.2;
        v3.add(Camera.position, Camera.velocity, Camera.position);
        Camera.velocity[1] = Camera.velocity[1] - 0.01;
        Camera.position[1] = Math.clamp(Camera.position[1], 10.0);
        // Camera.position[0] = Math.clamp(Camera.position[0], -50, 50);
        // Camera.position[2] = Math.clamp(Camera.position[2], -50, 50);
    }

    return {
        getKeyState: getKeyState,
        initialize: initialize,
        update: update
    }

}());

document.addEventListener('DOMContentLoaded', Controls.initialize);
