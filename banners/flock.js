const COLLISION_RADIUS = 80;

class Entity {
    constructor(x, y) {
        this.position = vec2.create(x, y);
        this.velocity = vec2.create(Math.random() * 10 - Math.random() * 10, Math.random() * 10 - Math.random() * 10);
        this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
    }

    update(delta, canvas) {

        const force = vec2.create(0, 0);
        const averageHeading = vec2.create(0, 0);
        const centerOfMass = vec2.create(0, 0);
        let adjacent = 0;
        for(let entity of entities) {
            if(vec2.distance(this.position, entity.position) <= COLLISION_RADIUS) {
                const toAgent = vec2.sub(this.position, entity.position);
                vec2.add(force, vec2.normalize(vec2.div(toAgent, vec2.length(toAgent))), force);
                vec2.add(averageHeading, vec2.normalize(entity.velocity), averageHeading);
                vec2.add(centerOfMass, entity.position, centerOfMass);
                adjacent++;
            }
        }
        vec2.div(averageHeading, adjacent, averageHeading);
        vec2.sub(averageHeading, vec2.normalize(this.velocity), averageHeading);
        vec2.add(force, averageHeading, force);
        if(adjacent > 0) {
            vec2.div(centerOfMass, adjacent, centerOfMass);
            const desired = vec2.mul(vec2.normalize(vec2.sub(centerOfMass, this.position)), 16);
            vec2.sub(desired, vec2.normalize(this.velocity), desired);
            vec2.add(force, desired, force);
        }

        vec2.div(force, 5, force);

        vec2.add(this.velocity, vec2.mul(force, 0.05), this.velocity);

        vec2.min(this.velocity, 10, this.velocity);
        vec2.max(this.velocity, 20, this.velocity);

        vec2.add(this.position, vec2.mul(this.velocity, 0.05), this.position);

        if(this.position[0] > canvas.width) this.position[0] = 0;
        if(this.position[0] < 0) this.position[0] = canvas.width;
        if(this.position[1] > canvas.height) this.position[1] = 0;
        if(this.position[1] < 0) this.position[1] = canvas.height;
    }

    render(ctx) {
        const [x, y] = this.position;
        const [nx, ny] = vec2.normalize(this.velocity);

        if(this.velocity[0] == 0 && this.velocity[1] == 0) {
            ctx.beginPath();
            ctx.ellipse(x, y, 8, 8, 0, Math.PI * 2, false);
            ctx.closePath();
        } else {
            ctx.beginPath();
            ctx.moveTo(x + ny * -4, y - nx * -4);
            ctx.lineTo(x + nx *  8, y + ny *  8);
            ctx.lineTo(x + ny *  4, y - nx *  4);
            ctx.closePath();
        }

        // ctx.strokeStyle = 'black';
        // ctx.fillStyle = 'white' // this.color;
        // ctx.fill();
        // ctx.stroke();

        let max = 0;
        for(let entity of entities) {
            let dist = vec2.distance(this.position, entity.position);
            if(dist <= COLLISION_RADIUS) {
                max++;
                if(max > 10) return;
                ctx.beginPath();
                ctx.moveTo(this.position[0], this.position[1]);
                ctx.lineTo(entity.position[0], entity.position[1]);
                ctx.closePath();

                ctx.strokeStyle = `#ffffff${(Math.min(Math.round(256 - (dist / COLLISION_RADIUS) * 256), 255)).toString(16).padStart(2,'0')}`;
                ctx.stroke();
            }
        }
    }
}

const entities = [];

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    for(let i = 0; i < 250; i++) {
        entities.push(new Entity(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }

    function render(delta) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        for(let entity of entities) {
            entity.update(delta, canvas);
        }

        for(let entity of entities) {
            entity.render(ctx);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

});