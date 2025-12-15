const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/*************************************************
 * Vector Utilities (Manual Math)
 *************************************************/
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
  sub(v) { return new Vec2(this.x - v.x, this.y - v.y); }
  scale(s) { return new Vec2(this.x * s, this.y * s); }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.length() || 1;
    return new Vec2(this.x / len, this.y / len);
  }
}

/*************************************************
 * Bézier Math
 *************************************************/
function cubicBezier(t, P0, P1, P2, P3) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;

  return P0.scale(uu * u)
    .add(P1.scale(3 * uu * t))
    .add(P2.scale(3 * u * tt))
    .add(P3.scale(tt * t));
}

function cubicBezierDerivative(t, P0, P1, P2, P3) {
  const u = 1 - t;

  return P1.sub(P0).scale(3 * u * u)
    .add(P2.sub(P1).scale(6 * u * t))
    .add(P3.sub(P2).scale(3 * t * t));
}

/*************************************************
 * Spring Physics (Manual)
 *************************************************/
class SpringPoint {
  constructor(pos) {
    this.position = pos;
    this.velocity = new Vec2(0, 0);
    this.target = pos;
  }

  update(dt, k, damping) {
    const displacement = this.position.sub(this.target);
    const acceleration = displacement.scale(-k)
      .sub(this.velocity.scale(damping));

    this.velocity = this.velocity.add(acceleration.scale(dt));
    this.position = this.position.add(this.velocity.scale(dt));
  }
}

/*************************************************
 * Control Points
 *************************************************/
const centerY = () => canvas.height / 2;

const P0 = new Vec2(100, centerY());
const P3 = new Vec2(() => canvas.width - 100, centerY());

const springP1 = new SpringPoint(new Vec2(300, centerY() - 100));
const springP2 = new SpringPoint(new Vec2(600, centerY() + 100));

const stiffness = 18;
const damping = 8;

/*************************************************
 * Mouse Input
 *************************************************/
let mouse = new Vec2(canvas.width / 2, canvas.height / 2);

canvas.addEventListener("mousemove", (e) => {
  mouse = new Vec2(e.clientX, e.clientY);

  springP1.target = mouse.add(new Vec2(-100, -50));
  springP2.target = mouse.add(new Vec2(100, 50));
});

/*************************************************
 * Rendering
 *************************************************/
function drawControlPoint(p, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawTangent(pos, dir) {
  const len = 30;
  const end = pos.add(dir.normalize().scale(len));

  ctx.strokeStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

/*************************************************
 * Main Loop
 *************************************************/
let lastTime = performance.now();

function loop(time) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update springs
  springP1.update(dt, stiffness, damping);
  springP2.update(dt, stiffness, damping);

  const p0 = P0;
  const p1 = springP1.position;
  const p2 = springP2.position;
  const p3 = new Vec2(canvas.width - 100, centerY());

  // Draw Bézier Curve
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 3;
  ctx.beginPath();

  for (let t = 0; t <= 1; t += 0.01) {
    const pt = cubicBezier(t, p0, p1, p2, p3);
    if (t === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  // Draw Tangents
  for (let t = 0; t <= 1; t += 0.1) {
    const pt = cubicBezier(t, p0, p1, p2, p3);
    const tan = cubicBezierDerivative(t, p0, p1, p2, p3);
    drawTangent(pt, tan);
  }

  // Draw Control Points
  drawControlPoint(p0, "#22c55e");
  drawControlPoint(p3, "#22c55e");
  drawControlPoint(p1, "#f97316");
  drawControlPoint(p2, "#f97316");

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
