const WIDTH = 640;
const HEIGHT = 420;

function field(root) {
  root.innerHTML = `
    <div class="play-wrap">
      <p class="play-help"></p>
      <canvas id="play" width="${WIDTH}" height="${HEIGHT}" tabindex="0" aria-label="Plateau"></canvas>
      <div class="play-bar">
        <p id="score">0</p>
        <button type="button" id="replay">Recommencer</button>
      </div>
    </div>`;
  const canvas = root.querySelector("#play");
  const ctx = canvas.getContext("2d");
  const score = root.querySelector("#score");
  const help = root.querySelector(".play-help");
  const keys = new Set();
  const onKey = (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) event.preventDefault();
    keys.add(event.key);
  };
  const offKey = (event) => keys.delete(event.key);
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", offKey);
  const pointer = { x: WIDTH / 2, y: HEIGHT / 2, down: false };
  const move = (event) => {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    pointer.x = ((source.clientX - rect.left) / rect.width) * WIDTH;
    pointer.y = ((source.clientY - rect.top) / rect.height) * HEIGHT;
  };
  canvas.addEventListener("pointerdown", (event) => {
    canvas.focus();
    pointer.down = true;
    move(event);
  });
  canvas.addEventListener("pointermove", move);
  window.addEventListener("pointerup", () => {
    pointer.down = false;
  });
  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("keyup", offKey);
  };
  root.querySelector("#replay").addEventListener("click", () => {
    stop();
    root._remount();
  });
  requestAnimationFrame(() => canvas.focus());
  return { canvas, ctx, score, help, keys, pointer, stop, setFrame: (id) => (frame = id) };
}

function loop(api, tick) {
  let last = performance.now();
  const step = (now) => {
    const id = requestAnimationFrame(step);
    api.setFrame(id);
    const dt = Math.min(32, now - last);
    last = now;
    tick(dt);
  };
  api.setFrame(requestAnimationFrame(step));
}

function mountLagon(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  let ball = { x: 320, y: 210, vx: 220, vy: -240 };
  let player = 280;
  let cpu = 280;
  let mine = 0;
  let theirs = 0;
  let over = false;
  const reset = (dir) => {
    ball = { x: 320, y: 210, vx: 220 * dir, vy: dir * -240 };
  };
  loop(api, (dt) => {
    const { ctx, keys, pointer } = api;
    if (!over) {
      if (pointer.down) player = pointer.x - 48;
      else {
        if (keys.has("ArrowLeft")) player -= 0.55 * dt;
        if (keys.has("ArrowRight")) player += 0.55 * dt;
      }
      player = Math.max(8, Math.min(WIDTH - 104, player));
      if (ball.x > cpu + 48) cpu += 0.42 * dt;
      if (ball.x < cpu + 48) cpu -= 0.42 * dt;
      cpu = Math.max(8, Math.min(WIDTH - 104, cpu));
      ball.x += (ball.vx * dt) / 1000;
      ball.y += (ball.vy * dt) / 1000;
      if (ball.x < 12 || ball.x > WIDTH - 12) ball.vx *= -1;
      if (ball.y < 28 && ball.x > cpu && ball.x < cpu + 96 && ball.vy < 0) {
        ball.vy = Math.abs(ball.vy) + 8;
        ball.vx += (ball.x - (cpu + 48)) * 3;
      }
      if (ball.y > HEIGHT - 28 && ball.x > player && ball.x < player + 96 && ball.vy > 0) {
        ball.vy = -Math.abs(ball.vy) - 8;
        ball.vx += (ball.x - (player + 48)) * 3;
      }
      if (ball.y < -10) {
        mine += 1;
        reset(1);
      }
      if (ball.y > HEIGHT + 10) {
        theirs += 1;
        reset(-1);
      }
      if (mine >= 7 || theirs >= 7) over = true;
    }
    ctx.fillStyle = "#06383d";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "rgba(243,255,252,0.35)";
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT / 2);
    ctx.lineTo(WIDTH, HEIGHT / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#e7fffb";
    ctx.fillRect(cpu, 16, 96, 12);
    ctx.fillStyle = "#7eeadf";
    ctx.fillRect(player, HEIGHT - 28, 96, 12);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 9, 0, Math.PI * 2);
    ctx.fill();
    api.score.textContent = over
      ? mine > theirs
        ? `Gagné ${mine} à ${theirs}`
        : `Perdu ${mine} à ${theirs}`
      : `${mine} — ${theirs}`;
  });
  return api.stop;
}

function mountQuai(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  const cols = 10;
  const rows = 16;
  const size = 26;
  const ox = (WIDTH - cols * size) / 2;
  const oy = 18;
  let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
  const shapes = {
    plank: [
      [[0, 0], [1, 0], [2, 0]],
      [[0, 0], [0, 1], [0, 2]],
    ],
    post: [
      [[0, 0], [1, 0]],
      [[0, 0], [0, 1]],
    ],
    crate: [[[0, 0], [1, 0], [0, 1], [1, 1]]],
  };
  const colors = ["#7eeadf", "#e7c27a", "#f3b6c8"];
  let piece = null;
  let lines = 0;
  let over = false;
  let acc = 0;
  const cells = () => shapes[piece.kind][piece.rot].map(([x, y]) => [piece.x + x, piece.y + y]);
  const fits = (next) =>
    next.every(([x, y]) => y < 0 || (x >= 0 && x < cols && y < rows && !grid[y][x]));
  const spawn = () => {
    const kinds = Object.keys(shapes);
    piece = { kind: kinds[Math.floor(Math.random() * kinds.length)], rot: 0, x: 3, y: 0 };
    if (!fits(cells())) over = true;
  };
  const lock = () => {
    const color = colors[Object.keys(shapes).indexOf(piece.kind)];
    cells().forEach(([x, y]) => {
      if (y >= 0) grid[y][x] = color;
    });
    grid = grid.filter((row) => row.some((cell) => !cell));
    const cleared = rows - grid.length;
    lines += cleared;
    while (grid.length < rows) grid.unshift(Array(cols).fill(0));
    spawn();
  };
  const tryMove = (dx, dy, drot = 0) => {
    const previous = { ...piece };
    piece = { ...piece, x: piece.x + dx, y: piece.y + dy, rot: (piece.rot + drot) % shapes[piece.kind].length };
    if (!fits(cells())) piece = previous;
    else return true;
    return false;
  };
  spawn();
  let left = false;
  let right = false;
  let up = false;
  let space = false;
  loop(api, (dt) => {
    if (!over) {
      if (api.keys.has("ArrowLeft") && !left) tryMove(-1, 0);
      if (api.keys.has("ArrowRight") && !right) tryMove(1, 0);
      if (api.keys.has("ArrowUp") && !up) tryMove(0, 0, 1);
      if (api.keys.has(" ") && !space) {
        while (tryMove(0, 1));
        lock();
      }
      left = api.keys.has("ArrowLeft");
      right = api.keys.has("ArrowRight");
      up = api.keys.has("ArrowUp");
      space = api.keys.has(" ");
      if (!over) {
        acc += dt;
        const speed = api.keys.has("ArrowDown") ? 50 : 460;
        if (acc > speed) {
          acc = 0;
          if (!tryMove(0, 1)) lock();
        }
      }
    }
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        api.ctx.strokeStyle = "rgba(243,255,252,0.08)";
        api.ctx.strokeRect(ox + x * size, oy + y * size, size, size);
        if (grid[y][x]) {
          api.ctx.fillStyle = grid[y][x];
          api.ctx.fillRect(ox + x * size + 1, oy + y * size + 1, size - 2, size - 2);
        }
      }
    }
    if (!over) {
      api.ctx.fillStyle = "#e7fffb";
      cells().forEach(([x, y]) => {
        if (y >= 0) api.ctx.fillRect(ox + x * size + 1, oy + y * size + 1, size - 2, size - 2);
      });
    }
    api.score.textContent = over ? `Quai plein — ${lines} lignes` : `${lines} lignes`;
  });
  return api.stop;
}

function mountRecif(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  const n = 16;
  const size = 24;
  const ox = (WIDTH - n * size) / 2;
  const oy = 16;
  let dir = { x: 1, y: 0 };
  let body = [
    { x: 4, y: 8 },
    { x: 3, y: 8 },
    { x: 2, y: 8 },
  ];
  const empty = () => {
    let spot = { x: 8, y: 8 };
    do {
      spot = { x: Math.floor(Math.random() * n), y: Math.floor(Math.random() * n) };
    } while (body.some((part) => part.x === spot.x && part.y === spot.y));
    return spot;
  };
  let food = empty();
  let acc = 0;
  let over = false;
  let score = 0;
  loop(api, (dt) => {
    if (api.keys.has("ArrowUp") && dir.y === 0) dir = { x: 0, y: -1 };
    if (api.keys.has("ArrowDown") && dir.y === 0) dir = { x: 0, y: 1 };
    if (api.keys.has("ArrowLeft") && dir.x === 0) dir = { x: -1, y: 0 };
    if (api.keys.has("ArrowRight") && dir.x === 0) dir = { x: 1, y: 0 };
    if (!over) {
      acc += dt;
      if (acc > 150) {
        acc = 0;
        const head = { x: body[0].x + dir.x, y: body[0].y + dir.y };
        const eats = head.x === food.x && head.y === food.y;
        const tail = eats ? body : body.slice(0, -1);
        if (head.x < 0 || head.y < 0 || head.x >= n || head.y >= n || tail.some((part) => part.x === head.x && part.y === head.y)) over = true;
        else {
          body.unshift(head);
          if (eats) {
            score += 1;
            food = empty();
          } else body.pop();
        }
      }
    }
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    api.ctx.fillStyle = "#e7c27a";
    api.ctx.fillRect(ox + food.x * size + 4, oy + food.y * size + 4, size - 8, size - 8);
    body.forEach((part, index) => {
      api.ctx.fillStyle = index === 0 ? "#e7fffb" : "#7eeadf";
      api.ctx.fillRect(ox + part.x * size + 1, oy + part.y * size + 1, size - 2, size - 2);
    });
    api.score.textContent = over ? `Échoué — ${score} perles` : `${score} perles`;
  });
  return api.stop;
}

function mountBouees(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  let lit = 4;
  let left = 1400;
  let hits = 0;
  let misses = 0;
  let over = false;
  const pick = () => {
    lit = Math.floor(Math.random() * 9);
    left = Math.max(550, 1400 - hits * 40);
  };
  const press = () => {
    if (over) return;
    const col = Math.floor((api.pointer.x - 170) / 100);
    const row = Math.floor((api.pointer.y - 70) / 100);
    if (col < 0 || row < 0 || col > 2 || row > 2) return;
    if (row * 3 + col === lit) {
      hits += 1;
      if (hits >= 20) over = true;
      else pick();
    } else {
      misses += 1;
      if (misses >= 3) over = true;
    }
  };
  api.canvas.addEventListener("pointerdown", press);
  loop(api, (dt) => {
    if (!over) {
      left -= dt;
      if (left <= 0) {
        misses += 1;
        if (misses >= 3) over = true;
        else pick();
      }
    }
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < 9; i += 1) {
      const x = 220 + (i % 3) * 100;
      const y = 120 + Math.floor(i / 3) * 100;
      api.ctx.fillStyle = i === lit ? "#e7c27a" : "#0e5960";
      api.ctx.beginPath();
      api.ctx.arc(x, y, 34, 0, Math.PI * 2);
      api.ctx.fill();
    }
    api.score.textContent = over ? (hits >= 20 ? "Vingt bouées" : `Trois ratés — ${hits}`) : `${hits}/20 · ratés ${misses}`;
  });
  return () => {
    api.canvas.removeEventListener("pointerdown", press);
    api.stop();
  };
}

function mountCoquillages(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  const names = ["Ancre", "Phare", "Voile", "Carte", "Corde", "Lune", "Dé", "Bulle"];
  let deck = names.flatMap((name) => [name, name]).sort(() => Math.random() - 0.5);
  let open = [];
  let found = new Set();
  let wait = 0;
  let moves = 0;
  const indexAt = () => {
    const col = Math.floor((api.pointer.x - 70) / 125);
    const row = Math.floor((api.pointer.y - 36) / 90);
    if (col < 0 || row < 0 || col > 3 || row > 3) return -1;
    return row * 4 + col;
  };
  const press = () => {
    if (wait > 0) return;
    const index = indexAt();
    if (index < 0 || found.has(index) || open.includes(index)) return;
    open.push(index);
    if (open.length === 2) {
      moves += 1;
      if (deck[open[0]] === deck[open[1]]) {
        found.add(open[0]);
        found.add(open[1]);
        open = [];
      } else wait = 700;
    }
  };
  api.canvas.addEventListener("pointerdown", press);
  loop(api, (dt) => {
    if (wait > 0) {
      wait -= dt;
      if (wait <= 0) open = [];
    }
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    deck.forEach((name, index) => {
      const x = 80 + (index % 4) * 125;
      const y = 40 + Math.floor(index / 4) * 90;
      const shown = found.has(index) || open.includes(index);
      api.ctx.fillStyle = shown ? "#e7fffb" : "#128b93";
      api.ctx.fillRect(x, y, 110, 74);
      api.ctx.fillStyle = "#062e33";
      api.ctx.font = "18px Segoe UI, sans-serif";
      api.ctx.fillText(shown ? name : "···", x + 28, y + 44);
    });
    api.score.textContent = found.size === 16 ? `Paires trouvées en ${moves} coups` : `${found.size / 2} paires · ${moves} coups`;
  });
  return () => {
    api.canvas.removeEventListener("pointerdown", press);
    api.stop();
  };
}

function mountEmpile(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  let mover = { x: 40, w: 180, dir: 1 };
  let stack = [{ x: 230, y: 360, w: 180 }];
  let over = false;
  let drop = false;
  const place = () => {
    if (over) return;
    const top = stack[stack.length - 1];
    const left = Math.max(mover.x, top.x);
    const right = Math.min(mover.x + mover.w, top.x + top.w);
    const w = right - left;
    if (w < 12) {
      over = true;
      return;
    }
    stack.push({ x: left, y: top.y - 22, w });
    mover = { x: 20, w, dir: 1 };
    if (stack.length > 14) stack.shift();
  };
  loop(api, (dt) => {
    if (!over) {
      mover.x += mover.dir * dt * 0.28;
      if (mover.x < 16 || mover.x + mover.w > WIDTH - 16) mover.dir *= -1;
      if ((api.keys.has(" ") || api.pointer.down) && !drop) place();
      drop = api.keys.has(" ") || api.pointer.down;
    }
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    api.ctx.fillStyle = "#7eeadf";
    stack.forEach((block) => api.ctx.fillRect(block.x, block.y, block.w, 20));
    if (!over) {
      api.ctx.fillStyle = "#e7c27a";
      api.ctx.fillRect(mover.x, stack[stack.length - 1].y - 48, mover.w, 20);
    }
    api.score.textContent = over ? `Pile tombée — ${stack.length} caisses` : `${stack.length} caisses`;
  });
  return api.stop;
}

function mountSlalom(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  let boat = WIDTH / 2;
  let gates = [];
  let dist = 0;
  let over = false;
  let spawn = 0;
  loop(api, (dt) => {
    if (!over) {
      if (api.keys.has("ArrowLeft")) boat -= 0.45 * dt;
      if (api.keys.has("ArrowRight")) boat += 0.45 * dt;
      if (api.pointer.down) boat = api.pointer.x;
      boat = Math.max(30, Math.min(WIDTH - 30, boat));
      spawn -= dt;
      if (spawn <= 0) {
        gates.push({ x: 40 + Math.random() * (WIDTH - 80), y: -20 });
        spawn = 700;
      }
      gates.forEach((gate) => (gate.y += dt * 0.28));
      if (gates.some((gate) => Math.abs(gate.x - boat) < 28 && Math.abs(gate.y - 340) < 24)) over = true;
      gates = gates.filter((gate) => gate.y < HEIGHT + 20);
      dist += dt * 0.01;
    }
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    api.ctx.fillStyle = "#e7c27a";
    gates.forEach((gate) => {
      api.ctx.beginPath();
      api.ctx.arc(gate.x, gate.y, 14, 0, Math.PI * 2);
      api.ctx.fill();
    });
    api.ctx.fillStyle = "#e7fffb";
    api.ctx.beginPath();
    api.ctx.moveTo(boat, 320);
    api.ctx.lineTo(boat - 16, 360);
    api.ctx.lineTo(boat + 16, 360);
    api.ctx.fill();
    api.score.textContent = over ? `Échoué à ${Math.floor(dist)} m` : `${Math.floor(dist)} m`;
  });
  return api.stop;
}

function mountBulles(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  let bubbles = [];
  let spawn = 0;
  let popped = 0;
  let lost = 0;
  let over = false;
  const press = () => {
    if (over) return;
    const hit = bubbles.findIndex((bubble) => Math.hypot(bubble.x - api.pointer.x, bubble.y - api.pointer.y) < bubble.r);
    if (hit >= 0) {
      bubbles.splice(hit, 1);
      popped += 1;
    }
  };
  api.canvas.addEventListener("pointerdown", press);
  loop(api, (dt) => {
    if (!over) {
      spawn -= dt;
      if (spawn <= 0) {
        bubbles.push({ x: 30 + Math.random() * (WIDTH - 60), y: HEIGHT + 20, r: 18 + Math.random() * 16, v: 0.08 + Math.random() * 0.1 });
        spawn = 520;
      }
      bubbles.forEach((bubble) => (bubble.y -= bubble.v * dt));
      const before = bubbles.length;
      bubbles = bubbles.filter((bubble) => bubble.y + bubble.r > 0);
      lost += before - bubbles.length;
      if (lost >= 3) over = true;
    }
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    api.ctx.strokeStyle = "#7eeadf";
    api.ctx.lineWidth = 3;
    bubbles.forEach((bubble) => {
      api.ctx.beginPath();
      api.ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      api.ctx.stroke();
    });
    api.score.textContent = over ? `Échappées — ${popped} percées` : `${popped} percées · ${lost} échappées`;
  });
  return () => {
    api.canvas.removeEventListener("pointerdown", press);
    api.stop();
  };
}

function mountCible(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  let shots = 10;
  let points = 0;
  let time = 0;
  const marks = [];
  const center = () => ({
    x: 320 + Math.sin(time / 400) * 180,
    y: 200 + Math.cos(time / 260) * 90,
  });
  const press = () => {
    if (shots <= 0) return;
    const c = center();
    const dist = Math.hypot(api.pointer.x - c.x, api.pointer.y - c.y);
    const gain = Math.max(0, Math.round(100 - dist));
    points += gain;
    shots -= 1;
    marks.push({ x: api.pointer.x, y: api.pointer.y });
  };
  api.canvas.addEventListener("pointerdown", press);
  loop(api, (dt) => {
    time += dt;
    const c = center();
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    [70, 48, 28].forEach((radius, index) => {
      api.ctx.fillStyle = ["#128b93", "#e7fffb", "#e7c27a"][index];
      api.ctx.beginPath();
      api.ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
      api.ctx.fill();
    });
    api.ctx.fillStyle = "#c4554a";
    marks.forEach((mark) => {
      api.ctx.fillRect(mark.x - 2, mark.y - 2, 4, 4);
    });
    api.score.textContent = shots === 0 ? `Tir fini — ${points} points` : `${points} points · ${shots} tirs`;
  });
  return () => {
    api.canvas.removeEventListener("pointerdown", press);
    api.stop();
  };
}

function carveMaze(width, height) {
  const cells = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ n: true, e: true, s: true, w: true, seen: false }))
  );
  const stack = [[0, 0]];
  cells[0][0].seen = true;
  const dirs = [
    [0, -1, "n", "s"],
    [1, 0, "e", "w"],
    [0, 1, "s", "n"],
    [-1, 0, "w", "e"],
  ];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const options = dirs.filter(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      return ny >= 0 && nx >= 0 && ny < height && nx < width && !cells[ny][nx].seen;
    });
    if (!options.length) {
      stack.pop();
      continue;
    }
    const [dx, dy, a, b] = options[Math.floor(Math.random() * options.length)];
    cells[y][x][a] = false;
    cells[y + dy][x + dx][b] = false;
    cells[y + dy][x + dx].seen = true;
    stack.push([x + dx, y + dy]);
  }
  return cells;
}

function mountDedale(root) {
  const api = field(root);
  api.help.textContent = root.dataset.help;
  const width = 15;
  const height = 11;
  const size = 28;
  const ox = (WIDTH - width * size) / 2;
  const oy = 24;
  const cells = carveMaze(width, height);
  let x = 0;
  let y = 0;
  let time = 0;
  let won = false;
  let held = false;
  loop(api, (dt) => {
    if (!won) time += dt;
    const key = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].find((name) => api.keys.has(name));
    if (key && !held && !won) {
      if (key === "ArrowUp" && !cells[y][x].n) y -= 1;
      if (key === "ArrowDown" && !cells[y][x].s) y += 1;
      if (key === "ArrowLeft" && !cells[y][x].w) x -= 1;
      if (key === "ArrowRight" && !cells[y][x].e) x += 1;
      if (x === width - 1 && y === height - 1) won = true;
    }
    held = Boolean(key);
    api.ctx.fillStyle = "#06383d";
    api.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    api.ctx.strokeStyle = "#7eeadf";
    api.ctx.lineWidth = 2;
    cells.forEach((row, cy) => {
      row.forEach((cell, cx) => {
        const px = ox + cx * size;
        const py = oy + cy * size;
        api.ctx.beginPath();
        if (cell.n) {
          api.ctx.moveTo(px, py);
          api.ctx.lineTo(px + size, py);
        }
        if (cell.e) {
          api.ctx.moveTo(px + size, py);
          api.ctx.lineTo(px + size, py + size);
        }
        if (cell.s) {
          api.ctx.moveTo(px, py + size);
          api.ctx.lineTo(px + size, py + size);
        }
        if (cell.w) {
          api.ctx.moveTo(px, py);
          api.ctx.lineTo(px, py + size);
        }
        api.ctx.stroke();
      });
    });
    api.ctx.fillStyle = "#e7c27a";
    api.ctx.fillRect(ox + (width - 1) * size + 6, oy + (height - 1) * size + 6, size - 12, size - 12);
    api.ctx.fillStyle = "#e7fffb";
    api.ctx.fillRect(ox + x * size + 8, oy + y * size + 8, size - 16, size - 16);
    api.score.textContent = won ? `Sorti en ${Math.floor(time / 1000)} s` : `${Math.floor(time / 1000)} s`;
  });
  return api.stop;
}

export const boards = {
  lagon: mountLagon,
  quai: mountQuai,
  recif: mountRecif,
  bouees: mountBouees,
  coquillages: mountCoquillages,
  empile: mountEmpile,
  slalom: mountSlalom,
  bulles: mountBulles,
  cible: mountCible,
  dedale: mountDedale,
};
