const COLLISION_RADIUS = 32;

class Entity {
    constructor(x, y) {
        let angle = Math.random() * 2 * Math.PI;
        this.velocity = vec2.create(Math.sin(angle), Math.cos(angle));

        this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
        
        this.position = vec2.create(x, y);
        this.acceleration = vec2.create(0, 0);
        this.r = 2.0;
        this.maxSpeed = 2;
        this.maxForce = 0.03;

        this.spatialX = 0;
        this.spatialY = 0;
    }

    seek(target) {
        const desired = vec2.sub(target, this.position);
        vec2.normalize(desired, desired);
        vec2.mul(desired, this.maxSpeed, desired);

        const steeringVector = vec2.sub(desired, this.velocity);
        vec2.max(steeringVector, this.maxForce, steeringVector);
        return steeringVector;
    }

    separate() {
        const desired = 25.0;
        const steeringVector = vec2.create(0, 0);
        let count = 0;

        for(let xx = -1; xx <= 1; xx++) {
            for(let yy = -1; yy <= 1; yy++) {
                let neighbors = spatialGrid[this.spatialY + yy]?.[this.spatialX + xx];
                if(!neighbors) continue;
                for(const other of neighbors) {
                    const d = vec2.distance(this.position, other.position);
                    if(d > 0 && d < desired) {
                        const diff = vec2.sub(this.position, other.position);
                        vec2.normalize(diff, diff); 
                        vec2.div(diff, d, diff); 
                        vec2.add(steeringVector, diff, steeringVector);
                        count++;
                    }
                }
            }
        }
        
        if(count > 0) {
            vec2.div(steeringVector, count, steeringVector); 
        }

        if(vec2.length(steeringVector) > 0) {
            vec2.normalize(steeringVector, steeringVector);
            vec2.mul(steeringVector, this.maxSpeed, steeringVector);
            vec2.sub(steeringVector, this.velocity, steeringVector);
            vec2.max(steeringVector, this.maxForce, steeringVector);
        }
        return steeringVector;
    }

    align() {
        const distance = 50.0;
        const sum = vec2.create(0, 0);
        let count = 0;

        for(let xx = -1; xx <= 1; xx++) {
            for(let yy = -1; yy <= 1; yy++) {
                let neighbors = spatialGrid[this.spatialY + yy]?.[this.spatialX + xx];
                if(!neighbors) continue;
                for(const other of neighbors) {
                    const d = vec2.distance(this.position, other.position);
                    if(d > 0 && d < distance) {
                        vec2.add(sum, other.velocity, sum);
                        count++;
                    }
                }
            }
        }

        if(count > 0) {
            vec2.div(sum, count, sum);
            vec2.normalize(sum, sum);
            const steeringVector = vec2.sub(sum, this.velocity);
            vec2.max(steeringVector, this.maxForce, steeringVector);
            return steeringVector;
        } else {
            return vec2.create(0, 0);
        }
    }

    cohese(neighbors) {
        const distance = 50.0;
        const sum = vec2.create(0, 0);
        let count = 0;

        for(let xx = -1; xx <= 1; xx++) {
            for(let yy = -1; yy <= 1; yy++) {
                let neighbors = spatialGrid[this.spatialY + yy]?.[this.spatialX + xx];
                if(!neighbors) continue;
                for(const other of neighbors) {
                    const d = vec2.distance(this.position, other.position);
                    if(d > 0 && d < distance) {
                        vec2.add(sum, other.position, sum);
                        count++;
                    }
                }
            }
        }
        if(count > 0) {
            vec2.div(sum, count, sum);
            return this.seek(sum);
        } else {
            return vec2.create(0, 0);
        }
    }

    update(delta, canvas) {

        const separation = this.separate();
        const alignment = this.align();
        const cohesion = this.cohese();

        vec2.mul(separation, 10.5, separation);
        vec2.mul(alignment, 1.0, alignment);
        vec2.mul(cohesion, 1.0, cohesion);
        
        vec2.add(this.acceleration, separation, this.acceleration);
        vec2.add(this.acceleration, alignment, this.acceleration);
        vec2.add(this.acceleration, cohesion, this.acceleration);

        vec2.add(this.velocity, this.acceleration, this.velocity);
        vec2.max(this.velocity, this.maxSpeed, this.velocity);
        vec2.add(this.position, this.velocity, this.position);
        vec2.mul(this.acceleration, 0, this.acceleration);

        if(this.position[0] > canvas.width) this.position[0] = 0;
        if(this.position[0] < 0) this.position[0] = canvas.width;
        if(this.position[1] > canvas.height) this.position[1] = 0;
        if(this.position[1] < 0) this.position[1] = canvas.height;

        // update spatial
        let nextX = Math.floor(this.position[0] / spatialSize);
        let nextY = Math.floor(this.position[1] / spatialSize);

        if(nextX !== this.spatialX || nextY !== this.spatialY) {
            const spatialPosition = spatialGrid[this.spatialY][this.spatialX].indexOf(this);
            if(spatialPosition !== -1) {
                spatialGrid[this.spatialY][this.spatialX].splice(spatialPosition, 1);
            }
            spatialGrid[nextY][nextX].push(this);
        }

        this.spatialX = nextX;
        this.spatialY = nextY;
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

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.stroke();
        // ctx.font = '8px serif';
        // ctx.fillText(`(${this.spatialX},${this.spatialY})`, this.position[0] + 8, this.position[1] + 8);
    }
}

const entities = [];
const spatialGrid = [];
const spatialSize = 64;

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    for(let y = 0; y <= canvas.height; y += spatialSize) {
        const row = [];
        for(let x = 0; x <= canvas.width; x += spatialSize) {
            row.push([]);
        }
        spatialGrid.push(row);
    }

    for(let i = 0; i < 1000; i++) {
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

        ctx.strokeStyle = '#222222';
        for(let x = 0; x < canvas.width; x += spatialSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.closePath();
            ctx.stroke();
        }
        for(let y = 0; y < canvas.height; y += spatialSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.closePath();
            ctx.stroke();
        }

        for(let entity of entities) {
            entity.render(ctx);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

});