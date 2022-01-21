const particles = [];

class Particle {
    constructor(x, y, c) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.vx = Math.random() * 10 - Math.random() * 10;
        this.vy = Math.random() * 10 - Math.random() * 10;
    }
    render(context) {
        // update
        this.x += this.vx;
        this.y += this.vy;
        this.vx /= 1.1;
        this.vy /= 1.1;
        // render
        context.fillStyle = fillStyles[this.c - 1];
        let size = Math.min(this.vx * 4, 8);
        context.fillRect(this.x - size / 2, this.y - size / 2, size, size);

        if(this.vx < 0.1 && this.vy < 0.1) {
            this.remove();
        }
    }
    remove() {
        particles.splice(particles.indexOf(this), 1);
    }
}

function addParticle(x, y, color) {
    particles.push(new Particle(x, y, color));
}

function renderParticles(ctx) {
    particles.forEach(p => p.render(ctx));
}
