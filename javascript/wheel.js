const colors = [
  "#3f72af",
  "#112d4e",
  "#212121",
  "#757575",
  "#00adb5",
  "#233142",
  "#393e46",
  "#111f4d",
];

const sectors = [
  { color: colors[6], label: "10 SOL" },
  { color: colors[1], label: "0.05 SOL" },
  { color: colors[4], label: "1 SOL" },
  { color: colors[3], label: "0.5 SOL" },
  { color: colors[5], label: "5 SOL" },
  { color: colors[2], label: "0.1 SOL" },
  { color: colors[7], label: "20 SOL" },
  { color: colors[0], label: "0.01 SOL" },
];

const initCanvas = () => {
  const bodyElement = document.getElementsByTagName("BODY")[0];
  const bodyWidth = bodyElement.offsetWidth;
  const canvasWidth = bodyWidth > 500 ? 500 : bodyWidth * 0.8;

  // Generate random float in range min-max:
  const rand = (m, M) => Math.random() * (M - m) + m;

  const tot = sectors.length;
  const elSpin = document.querySelector("#spin");
  const canvas = document.getElementById("wheel-of-fortune-canvas");
  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasWidth);
  const ctx = document.querySelector("#wheel-of-fortune-canvas").getContext`2d`;
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / sectors.length;
  const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
  const angVelMin = 0.002; // Below that number will be treated as a stop
  let angVelMax = 0; // Random ang.vel. to acceletare to
  let angVel = 0; // Current angular velocity
  let ang = 0; // Angle rotation in radians
  let isSpinning = false;
  let isAccelerating = false;

  //* Get index of current sector */
  const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

  //* Draw sectors and prizes texts to canvas */
  const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${canvasWidth * 0.05}px sans-serif`;
    ctx.fillText(sector.label, rad - 10, 10);
    //
    ctx.restore();
  };

  //* CSS rotate CANVAS Element */
  const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    elSpin.textContent = !angVel ? "SPIN" : sector.label;
    elSpin.style.background = sector.color;
  };

  const frame = () => {
    if (!isSpinning) return;

    if (angVel >= angVelMax) isAccelerating = false;

    // Accelerate
    if (isAccelerating) {
      angVel ||= angVelMin; // Initial velocity kick
      angVel *= 1.06; // Accelerate
    }

    // Decelerate
    else {
      isAccelerating = false;
      angVel *= friction; // Decelerate by friction

      // SPIN END:
      if (angVel < angVelMin) {
        isSpinning = false;
        angVel = 0;
      }
    }

    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate(); // CSS rotate!
  };

  const engine = () => {
    frame();
    requestAnimationFrame(engine);
  };

  elSpin.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.25, 0.4);
  });

  // INIT!
  sectors.forEach(drawSector);
  rotate(); // Initial rotation
  engine(); // Start engine!
};

initCanvas();
window.addEventListener("resize", initCanvas, true);
