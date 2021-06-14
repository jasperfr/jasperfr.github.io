const _particles = [];

class XParticle {
    constructor(x, y, xv, yv, el) {
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
        this.$el = el;

        this.$el.css('position', 'absolute');
        $('#particles').append(this.$el);
        _particles.push(this);
    }

    update() {
        this.x += this.xv;
        this.y += this.yv;
        this.$el.css('left', `${this.x}px`);
        this.$el.css('top', `${this.y}px`);
    }

    remove() {
        this.$el.remove();
        _particles.splice(_particles.indexOf(this), 1);
    }
}

class FireParticle extends XParticle {
    constructor(x, y, xv, yv) {
        super(x, y, xv, yv, $('<div class="fire" />'));
        setTimeout(() => this.remove(), 1000);
    }
}

$(() => {
    setInterval(() => {
        new FireParticle(Math.random() + 1145, Math.random() + 810, 3, 3);
        new FireParticle(Math.random() + 780, Math.random() + 810, -3, 3);
        new FireParticle(Math.random() + 1145, Math.random() + 100, 3, -3);
        new FireParticle(Math.random() + 780, Math.random() + 100, -3, -3);
        _particles.forEach(p => p.update());
    }, 17);
});