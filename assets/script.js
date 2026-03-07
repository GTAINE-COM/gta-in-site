const burgerBtn = document.getElementById("burgerBtn");
const mainNav = document.getElementById("mainNav");

if (burgerBtn && mainNav) {
  burgerBtn.addEventListener("click", () => {
    mainNav.classList.toggle("is-open");
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

  spinBtn.addEventListener("click", () => {
    if (spinning) return;
    spinning = true;

    spinBtn.disabled = true;
    spinBtn.textContent = "Крутимо...";

    rouletteTrack.style.transition = "none";
    rouletteTrack.style.transform = "translateX(0px)";

    const itemWidth = 194;
    const randomIndex = Math.floor(Math.random() * rewards.length);
    const loops = 3;
    const offset = (loops * rewards.length + randomIndex) * itemWidth;

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
