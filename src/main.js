import "./style.css";
import { games, themes } from "./data/catalog.js";
import { createHarbor } from "./harbor.js";
import { boards } from "./play/arcade.js";

const dock = document.querySelector("#dock");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const search = document.querySelector("#search");
const sheet = document.querySelector("#sheet");
const body = document.querySelector("#sheet-body");
let theme = "tous";
let disposePlay = null;
let hot = null;

let harbor = { setGames() {}, destroy() {} };
try {
  harbor = createHarbor(document.querySelector("#harbor"));
} catch (error) {
  console.error("Le port 3D n'a pas pu démarrer.", error);
}

function visible() {
  const query = search.value.trim().toLowerCase();
  return games.filter((game) => {
    const inTheme = theme === "tous" || game.theme === theme;
    const blob = `${game.name} ${game.summary}`.toLowerCase();
    return inTheme && (!query || blob.includes(query));
  });
}

function render() {
  const list = visible();
  dock.innerHTML = "";
  list.forEach((game) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.theme = game.theme;
    button.dataset.game = game.id;
    const label = themes.find((item) => item.id === game.theme).label;
    const people = game.players === "1" ? "1 joueur" : `${game.players} joueurs`;
    button.innerHTML = `<span class="tag">${label}</span><h2>${game.name}</h2><p>${game.summary}</p><span class="facts">${people} · ${game.duration}</span>`;
    button.addEventListener("click", () => openGame(game.id));
    button.addEventListener("pointerenter", () => {
      hot = game.id;
      button.classList.add("is-hot");
    });
    dock.append(button);
  });
  count.textContent = `${list.length} jeu${list.length > 1 ? "x" : ""} sur le pont`;
  empty.hidden = list.length > 0;
  harbor.setGames(list);
}

function openGame(id) {
  const game = games.find((item) => item.id === id);
  if (!game) return;
  if (disposePlay) disposePlay();
  disposePlay = null;
  document.querySelector("#sheet-kicker").textContent = themes.find((item) => item.id === game.theme).label;
  document.querySelector("#sheet-title").textContent = game.name;
  document.querySelector("#sheet-meta").textContent = `${game.players === "1" ? "1 joueur" : `${game.players} joueurs`} · ${game.duration}`;
  body.innerHTML = "";
  if (game.kind === "rules") {
    game.rules.forEach((rule) => {
      const section = document.createElement("section");
      section.className = "rule";
      section.innerHTML = `<h3>${rule.h}</h3><p>${rule.p}</p>`;
      body.append(section);
    });
  } else if (game.kind === "knot") {
    game.steps.forEach((step, index) => {
      const section = document.createElement("section");
      section.className = "step";
      section.innerHTML = `${step.svg}<div><h3>${index + 1}. ${step.t}</h3><p>${step.d}</p></div>`;
      body.append(section);
    });
  } else {
    const mount = document.createElement("div");
    mount.dataset.help = game.help;
    body.append(mount);
    const stop = boards[game.playId](mount);
    mount._remount = () => {
      if (disposePlay) disposePlay();
      disposePlay = null;
      openGame(id);
    };
    disposePlay = stop;
  }
  if (!sheet.open) sheet.showModal();
}

document.querySelector("#sheet-close").addEventListener("click", () => sheet.close());
sheet.addEventListener("close", () => {
  if (disposePlay) disposePlay();
  disposePlay = null;
  body.innerHTML = "";
});
sheet.addEventListener("cancel", () => {
  if (disposePlay) disposePlay();
  disposePlay = null;
});

document.querySelectorAll(".theme").forEach((button) => {
  button.addEventListener("click", () => {
    theme = button.dataset.theme;
    document.querySelectorAll(".theme").forEach((item) => item.classList.toggle("is-on", item === button));
    render();
  });
});

search.addEventListener("input", render);
document.querySelector("#phare").addEventListener("click", () => {
  const list = visible();
  const pick = list[Math.floor(Math.random() * list.length)];
  if (pick) openGame(pick.id);
});

render();

window.__gameaboard = { games, openGame, visible };
