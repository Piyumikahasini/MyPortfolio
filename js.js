let canvas, ctx, w, h, particles = [];
let mouse = {
    x: undefined,
    y: undefined
}
let hue = 0;

function init() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    resizeReset();
    animationLoop();
}

function resizeReset() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

function mousemove(e) {
    mouse.x = e.x;
    mouse.y = e.y;
}

function mouseout() {
    mouse.x = undefined;
    mouse.y = undefined;
}

function animationLoop() {
    if (mouse.x != undefined && mouse.y != undefined) {
        hue += 2;
        particles.push(new Particle(mouse.x, mouse.y));
    }

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    drawScene();
    arrayCleanup();
    requestAnimationFrame(animationLoop);
}

function arrayCleanup() {
    let dump = [];
    particles.map((particle) => {
        if (particle.radius > 0) {
            dump.push(particle);
        }
    });
    particles = dump;
}

function drawScene() {
    particles.map((particle) => {
        particle.update();
        particle.draw();
    })
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.size = 0;
        this.rotate = 0;
        this.hue = hue % 360;
        this.alpha = 0.5;
    }
    setPoint() {
        let r, x, y;
        this.point = [];
        for (let a = 0; a < 360; a += 36) {
            let d = ((a / 36) % 2 === 0) ? this.size : this.size / 2;
            r = (Math.PI / 180) * (a + this.rotate);
            x = this.x + d * Math.sin(r);
            y = this.y + d * Math.cos(r);
            this.point.push({x: x, y: y, r: this.radius});
        }
    }
    draw() {
        if (this.radius <= 0) return;
        // draw points
        this.point.map((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
            ctx.fill();
            ctx.closePath();
        });

        // draw lines
        ctx.beginPath();
        for (let i = 0; i < this.point.length; i++) {
            if (i === 0) {
                ctx.moveTo(this.point[i].x, this.point[i].y);
            } else {
                ctx.lineTo(this.point[i].x, this.point[i].y);
            }
        }
        ctx.closePath();
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
        ctx.stroke();
    }
    update() {
        this.setPoint();
        this.radius -= .05;
        this.size += .5;
        this.rotate -= 1;
        this.alpha = (this.radius * 0.5 < 0.5) ? this.radius * 0.5 : 0.5;
    }
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resizeReset);
window.addEventListener("mousemove", mousemove);
window.addEventListener("mouseout", mouseout);