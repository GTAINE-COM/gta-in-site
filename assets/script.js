const burgerBtn = document.getElementById("burgerBtn");
const mainNav = document.getElementById("mainNav");

if (burgerBtn && mainNav) {
  burgerBtn.addEventListener("click", () => {
    mainNav.classList.toggle("is-open");
  });

  document.addEventListener("click", (event) => {
    const insideNav = mainNav.contains(event.target);
    const insideBurger = burgerBtn.contains(event.target);

    if (!insideNav && !insideBurger) {
      mainNav.classList.remove("is-open");
    }
  });
}

document.querySelectorAll(".cabinet-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.cabinetTab;

    document.querySelectorAll(".cabinet-tab").forEach((item) => {
      item.classList.remove("is-active");
    });
    btn.classList.add("is-active");

    document.querySelectorAll("[data-cabinet-content]").forEach((panel) => {
      panel.classList.remove("cabinet-panel--active");
    });

    const target = document.querySelector(`[data-cabinet-content="${key}"]`);
    if (target) target.classList.add("cabinet-panel--active");
  });
});

const spinBtn = document.getElementById("spinBtn");
const rouletteTrack = document.getElementById("rouletteTrack");
const rouletteResult = document.getElementById("rouletteResult");
const rouletteResultText = document.getElementById("rouletteResultText");

if (spinBtn && rouletteTrack) {
  const rewards = [
    { title: "50 000 ₴", text: "Випали звичайні гроші." },
    { title: "100 DC", text: "Випала рідкісна донат-валюта." },
    { title: "BMW M5", text: "Випав епічний автомобіль." },
    { title: "20 000 ₴", text: "Ще один грошовий виграш." },
    { title: "VIP Silver", text: "Випав статус Silver." },
    { title: "10 000 ₴", text: "Невеликий, але приємний виграш." },
    { title: "Sultan RS", text: "Випав спортивний автомобіль." },
    { title: "250 DC", text: "Хороший виграш донат-валюти." },
    { title: "75 000 ₴", text: "Великий грошовий приз." },
    { title: "Будинок", text: "Епічний приз — нерухомість." },
    { title: "30 000 ₴", text: "Грошовий бонус." },
    { title: "Кейс", text: "Бонусний кейс у рулетці." }
  ];

  let spinning = false;
  const baseItems = Array.from(rouletteTrack.children).map((item) => item.outerHTML);

  if (rouletteTrack.children.length < rewards.length * 3) {
    rouletteTrack.innerHTML = baseItems.concat(baseItems, baseItems, baseItems).join("");
  }

  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;

    spinBtn.disabled = true;
    spinBtn.textContent = "Крутимо...";

    const itemWidth = 194;
    const total = rewards.length;
    const randomIndex = Math.floor(Math.random() * total);
    const loops = 2;
    const centerOffset = 220;
    const targetIndex = total * loops + randomIndex;
    const offset = targetIndex * itemWidth - centerOffset;

    rouletteTrack.style.transition = "none";
    rouletteTrack.style.transform = "translateX(0px)";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rouletteTrack.style.transition = "transform 4.2s cubic-bezier(.08,.9,.2,1)";
        rouletteTrack.style.transform = `translateX(-${offset}px)`;
      });
    });

    setTimeout(() => {
      const prize = rewards[randomIndex];
      if (rouletteResult) rouletteResult.textContent = prize.title;
      if (rouletteResultText) rouletteResultText.textContent = prize.text;

      spinBtn.disabled = false;
      spinBtn.textContent = "Крутити";
      spinning = false;
    }, 4300);
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const login = document.getElementById("login")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (login === "admin" && password === "1234") {
      window.location.href = "cabinet.html";
      return;
    }

    alert("Невірний логін або пароль. Для демо використай: admin / 1234");
  });
}
