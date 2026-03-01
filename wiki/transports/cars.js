// GTAINE транспорти — фотокаталог (пачками, чтобы не лагало на 700+)

const grid = document.getElementById("carsGrid");
const countEl = document.getElementById("carsCount");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let CARS = [];
let rendered = 0;
const STEP = 60; // сколько рисуем за 1 раз

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m]));
}

function cardTemplate(car) {
  const name = escapeHtml(car.name || car.title || car.model || "");
  const img = car.img || car.image || car.photo || car.picture || "";

  return `
    <div class="car-card">
      <div class="car-img">
        <img src="${img}" alt="${name}" loading="lazy">
      </div>
      ${name ? `<div class="car-name">${name}</div>` : ``}
    </div>
  `;
}

function renderNext() {
  const next = CARS.slice(rendered, rendered + STEP);
  if (!next.length) {
    loadMoreBtn.style.display = "none";
    return;
  }

  const html = next.map(cardTemplate).join("");
  grid.insertAdjacentHTML("beforeend", html);

  rendered += next.length;

  if (rendered >= CARS.length) {
    loadMoreBtn.style.display = "none";
  }
}

async function init() {
  try {
    // ВАЖНО: cars.json лежит в этой же папке
    const res = await fetch("./cars.json", { cache: "no-store" });
    if (!res.ok) throw new Error("cars.json not found: " + res.status);

    const data = await res.json();

    // поддержка разных форматов:
    // либо массив [{name,img}, ...]
    // либо объект {cars:[...]}
    CARS = Array.isArray(data) ? data : (data.cars || data.items || []);

    countEl.textContent = String(CARS.length);

    rendered = 0;
    grid.innerHTML = "";
    loadMoreBtn.style.display = "inline-flex";

    renderNext();
  } catch (e) {
    console.error(e);
    grid.innerHTML = `
      <div class="errorbox">
        Помилка завантаження транспорту. Перевір <b>cars.json</b> та шлях.
      </div>
    `;
    loadMoreBtn.style.display = "none";
    countEl.textContent = "0";
  }
}

loadMoreBtn.addEventListener("click", renderNext);

// Автоподгрузка при прокрутке (приятно)
window.addEventListener("scroll", () => {
  if (loadMoreBtn.style.display === "none") return;
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 700;
  if (nearBottom) renderNext();
});

init();
