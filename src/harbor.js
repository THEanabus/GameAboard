import * as THREE from "three";
import { themeOf } from "./data/catalog.js";

export function createHarbor(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x087f86, 9, 22);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  camera.position.set(0, 5.4, 9.2);
  camera.lookAt(0, 0.2, 0);

  scene.add(new THREE.HemisphereLight(0xe7fffb, 0x064e55, 1.15));
  const sun = new THREE.DirectionalLight(0xfff6df, 1.35);
  sun.position.set(4, 8, 2);
  scene.add(sun);

  const waterGeo = new THREE.PlaneGeometry(28, 28, 48, 48);
  const water = new THREE.Mesh(
    waterGeo,
    new THREE.MeshStandardMaterial({ color: 0x0aa7b0, metalness: 0.25, roughness: 0.28 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.4;
  scene.add(water);
  const base = waterGeo.attributes.position.array.slice();

  const quay = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.25, 0.28, 8),
    new THREE.MeshStandardMaterial({ color: 0xe7c27a, roughness: 0.7 })
  );
  quay.position.y = -0.15;
  scene.add(quay);
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 1.5, 12),
    new THREE.MeshStandardMaterial({ color: 0xf3fffc, roughness: 0.45 })
  );
  post.position.y = 0.7;
  scene.add(post);

  const group = new THREE.Group();
  scene.add(group);
  let meshes = [];

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  }

  function setGames(list) {
    meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.map?.dispose();
      mesh.material.dispose();
    });
    group.clear();
    meshes = list.slice(0, 18).map((game, index) => {
      const theme = themeOf(game.theme);
      const texture = labelTexture(game.name, theme.harbor);
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 0.08, 0.92),
        new THREE.MeshStandardMaterial({ color: theme.harbor, map: texture, roughness: 0.42, metalness: 0.08 })
      );
      const angle = (index / Math.max(list.length, 1)) * Math.PI * 2;
      const radius = 3.1 + (index % 2) * 1.15;
      mesh.position.set(Math.cos(angle) * radius, 0.15, Math.sin(angle) * radius);
      mesh.lookAt(0, 0.15, 0);
      mesh.userData.phase = index;
      group.add(mesh);
      return mesh;
    });
  }

  let frame = 0;
  const clock = new THREE.Clock();
  function animate() {
    frame = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const pos = waterGeo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      pos.setZ(i, Math.sin(x * 0.55 + t) * 0.07 + Math.cos(y * 0.4 + t * 0.8) * 0.05);
    }
    pos.needsUpdate = true;
    meshes.forEach((mesh) => {
      mesh.position.y = 0.18 + Math.sin(t * 1.2 + mesh.userData.phase) * 0.08;
    });
    group.rotation.y = t * 0.08;
    renderer.render(scene, camera);
  }

  resize();
  animate();
  window.addEventListener("resize", resize);

  return {
    setGames,
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    },
  };
}

function labelTexture(name, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f3fffc";
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
  ctx.fillRect(0, 0, 512, 18);
  ctx.fillStyle = "#062e33";
  ctx.font = "600 54px Palatino, Georgia, serif";
  wrap(ctx, name, 36, 150, 440, 62);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function wrap(ctx, text, x, y, max, line) {
  const words = text.split(" ");
  let row = "";
  const rows = [];
  words.forEach((word) => {
    const trial = `${row}${word} `;
    if (ctx.measureText(trial).width > max && row) {
      rows.push(row.trim());
      row = `${word} `;
    } else row = trial;
  });
  rows.push(row.trim());
  rows.slice(0, 3).forEach((item, index) => ctx.fillText(item, x, y + index * line));
}
