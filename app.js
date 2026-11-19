// Three-card spread: Past / Present / Future.
// Draws 3 distinct cards from the 78-card Rider-Waite deck, each upright or reversed.
const POSITIONS = ["Past", "Present", "Future"];
const BACK = "cards/CardBacks.jpg";

const deckBtn = document.getElementById("deckBtn");
const deckImg = document.getElementById("deckImg");
const spreadEl = document.getElementById("spread");
const readingEl = document.getElementById("reading");
const readingText = document.getElementById("readingText");
const againBtn = document.getElementById("againBtn");
const shareBtn = document.getElementById("shareBtn");
const copiedEl = document.getElementById("copied");
const modal = document.getElementById("modal");

let currentDraw = []; // [{card, reversed}]

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function draw() {
  deckBtn.disabled = true;
  deckBtn.classList.add("shuffling");
  deckImg.alt = "Shuffling the deck";
  readingEl.hidden = true;
  copiedEl.hidden = true;

  setTimeout(() => {
    const picked = shuffle(CARDS).slice(0, 3);
    currentDraw = picked.map((card) => ({ card, reversed: Math.random() < 0.5 }));
    renderSpread();
    deckBtn.classList.remove("shuffling");
    deckBtn.disabled = false;
    deckImg.alt = "Tarot deck";
    document.getElementById("intro").style.display = "none";
  }, 900);
}

function cardFaceHTML(drawn) {
  const rev = drawn.reversed ? ' class="reversed"' : "";
  return (
    '<div class="face back"><img src="' + BACK + '" alt="Card back"></div>' +
    '<div class="face front"><img src="cards/' + drawn.card.f + '" alt="' + drawn.card.n + '"' + rev + "></div>"
  );
}

function renderSpread() {
  spreadEl.hidden = false;
  const slots = spreadEl.querySelectorAll(".slot");
  slots.forEach((slot, i) => {
    const drawn = currentDraw[i];
    const side = drawn.reversed ? drawn.card.r : drawn.card.u;
    const cardEl = slot.querySelector(".card");
    cardEl.innerHTML = cardFaceHTML(drawn);
    cardEl.classList.remove("flipped");
    slot.querySelector(".card-name").textContent = drawn.card.n;
    slot.querySelector(".card-ori").textContent = drawn.reversed ? "Reversed" : "Upright";
    slot.querySelector(".card-keys").textContent = side[0];
    slot.classList.remove("show");
    // Flip in one by one, left to right.
    setTimeout(() => {
      slot.classList.add("show");
      cardEl.classList.add("flipped");
    }, 250 + i * 450);
    cardEl.onclick = () => openModal(drawn);
    cardEl.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(drawn); } };
  });

  // Reading text appears once the last card has flipped.
  setTimeout(renderReading, 250 + 2 * 450 + 600);
}

function renderReading() {
  let html = "";
  currentDraw.forEach((drawn, i) => {
    const side = drawn.reversed ? drawn.card.r : drawn.card.u;
    html +=
      '<p><span class="pos">' + POSITIONS[i] + " — " + drawn.card.n +
      (drawn.reversed ? " (reversed)" : "") + "</span><br>" +
      side[1] + "</p>";
  });
  html += "<p>Read them together: where you have been shapes where you stand, and where you stand points at where you are headed. The cards suggest the shape of the road — you still choose how to walk it.</p>";
  readingText.innerHTML = html;
  readingEl.hidden = false;
  readingEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function openModal(drawn) {
  const side = drawn.reversed ? drawn.card.r : drawn.card.u;
  const img = document.getElementById("modalImg");
  img.src = "cards/" + drawn.card.f;
  img.alt = drawn.card.n;
  img.className = drawn.reversed ? "reversed" : "";
  document.getElementById("modalName").textContent = drawn.card.n;
  document.getElementById("modalOri").textContent =
    (drawn.reversed ? "Reversed" : "Upright") + " · " + drawn.card.a + " Arcana";
  document.getElementById("modalKeys").textContent = side[0];
  document.getElementById("modalMeaning").textContent = side[1];
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function readingAsText() {
  const lines = ["Three-Card Tarot — Past · Present · Future", ""];
  currentDraw.forEach((drawn, i) => {
    const side = drawn.reversed ? drawn.card.r : drawn.card.u;
    lines.push(POSITIONS[i] + ": " + drawn.card.n + (drawn.reversed ? " (reversed)" : ""));
    lines.push(side[0]);
    lines.push(side[1]);
    lines.push("");
  });
  return lines.join("\n");
}

deckBtn.addEventListener("click", draw);
againBtn.addEventListener("click", draw);
shareBtn.addEventListener("click", async () => {
  const text = readingAsText();
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // Clipboard API unavailable (old browser / non-secure context): fall back.
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  copiedEl.hidden = false;
});
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
