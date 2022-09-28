var canvasWidth = 600;
var canvasHeight = 600;

const pi = Math.PI;
const tau = 2 * pi;

function collision(x0, y0, x1, y1, cx, cy, cr) {
    let dx = cx - x0, dy = cy - y0;
    let dxx = x1 - x0, dyy = y1 - y0;
    let t = (dx*dxx+dy*dyy)/(dxx**2+dyy**2);
    let x=x0+dxx*t,y=y0+dyy*t;
    if(t<0){x=x0;y=y0}
    if(t>1){x=x1;y=y1}
    return((cx-x)**2+(cy-y)**2<cr**2);
}

class Ball {
    constructor(position, velocity, color) {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
    }
    
    update(delta) {
        const restitution = 0.5;

        this.velocity.add(0, 0.6);

        for(let ball of balls) {
            let dist = Math.sqrt((ball.position.x - this.position.x) ** 2 + (ball.position.y - this.position.y) ** 2);

            if(dist > 0 && dist < 32) {
                let vCollision = new Vector2(ball.position.x - this.position.x, ball.position.y - this.position.y);
                let distance = vCollision.magnitude;
                let vCollisionNorm = new Vector2(vCollision.x / distance, vCollision.y / distance);
                let vRelativeVelocity = new Vector2(this.velocity.x - ball.velocity.x, this.velocity.y - ball.velocity.y);
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y + vCollisionNorm.y;
                if(speed < 0) { break; }
                speed *= restitution;
                this.velocity.x -= (speed * vCollisionNorm.x);
                this.velocity.y -= (speed * vCollisionNorm.y);
                ball.velocity.x += (speed * vCollisionNorm.x);
                ball.velocity.y += (speed * vCollisionNorm.y);
            }
        }
        
        for(let line of lines) {
            if(collision(line.position1.x, line.position1.y, line.position2.x, line.position2.y, this.position.x, this.position.y, 16)) {
                let n = new Vector2(line.normal.x, line.normal.y);
                let v = this.velocity;
                let dot = n.x * v.x + n.y * v.y;
                let p = 2 * dot;
                n.mul(p);

                this.velocity.x -= (n.x)
                this.velocity.y -= (n.y)
            }
        }

        //this.velocity.mul(0.995, 0.995);
        this.velocity.clamp(-8, 8);

        this.position.add(this.velocity);
        
        if(this.position.x < 16) { this.position.x = 16; this.velocity.x = Math.abs(this.velocity.x) * restitution; }
        if(this.position.x > canvasWidth-16) { this.position.x = canvasWidth-16; this.velocity.x = -Math.abs(this.velocity.x) * restitution; }
        if(this.position.y > canvasHeight-16) { this.position.y = canvasHeight-16; this.velocity.y = -Math.abs(this.velocity.y) * restitution; }
        if(this.position.y < 16) { this.position.y = 16; this.velocity.y = Math.abs(this.velocity.y) * restitution; }
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(
            this.position.x,
            this.position.y,
            16, 16, 0, 0, tau);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fff';
    }
}

class Line {
    constructor(from, to) {
        this.position1 = from;
        this.position2 = to;
    }

    get normal() {
        const dx = this.position2.x - this.position1.x;
        const dy = this.position2.y - this.position1.y;
        const dv = new Vector2(dy, -dx);
        return dv.normalized;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.position1.x, this.position1.y);
        ctx.lineTo(this.position2.x, this.position2.y);
        ctx.stroke();
    }
}

const lines = [
    // new Line(new Vector2(0, 600), new Vector2(800, 800)),
    // new Line(new Vector2(100, 400), new Vector2(800, 200)),
]

const balls = [] //Array(50).fill(null).map(() => new Ball(
//     new Vector2(Math.random() * 800, Math.random() * 800),
//     new Vector2(0, 0),
//     '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
// ));
let i = 0;

window.addEventListener('resize', () => {
    const frame = document.getElementById('frame');
    const canvas = document.getElementById('canvas');
    canvas.width = frame.offsetWidth;
    canvas.height = frame.offsetHeight;

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
})

document.addEventListener('DOMContentLoaded', () => {
    const frame = document.getElementById('frame');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = frame.offsetWidth;
    canvas.height = frame.offsetHeight;

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    let j = 0;
    function render(delta) {
        j++;
        if(j > 1 && balls.length < 400) { j = 0; balls.push(
        new Ball(
            new Vector2(canvasWidth / 2, canvasHeight / 2),
            new Vector2((Math.random() - Math.random()) * 100, -10 + Math.random()
        ), 
    '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
        )) }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        balls.forEach(ball => ball.update());
        balls.forEach(ball => ball.render(ctx));

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

});