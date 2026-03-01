async function loadCars() {
  const res = await fetch("./cars.json");
  return await res.json();
}

function normalize(s){ return String(s || "").toLowerCase(); }

function renderTable(cars){
  const tbody = document.querySelector("#carsBody");
  tbody.innerHTML = cars.map(c => `
    <tr>
      <td><b>${c.name}</b></td>
      <td>${c.class}</td>
      <td>${c.price} грн</td>
      <td>${c.where}</td>
      <td>${c.req}</td>
    </tr>
  `).join("");
  document.querySelector("#carsCount").textContent = cars.length;
}

function applyFilters(allCars){
  const q = normalize(document.querySelector("#carsSearch").value);
  const cls = document.querySelector("#carsClass").value;

  let out = allCars.filter(c => {
    const okSearch = !q || normalize(c.name).includes(q);
    const okClass = !cls || c.class === cls;
    return okSearch && okClass;
  });

  renderTable(out);
}

(async () => {
  const allCars = await loadCars();

  // заполнить селект классами
  const classes = [...new Set(allCars.map(c => c.class))].sort();
  const sel = document.querySelector("#carsClass");
  sel.innerHTML = `<option value="">Усі класи</option>` + classes.map(x => `<option>${x}</option>`).join("");

  renderTable(allCars);

  document.querySelector("#carsSearch").addEventListener("input", () => applyFilters(allCars));
  document.querySelector("#carsClass").addEventListener("change", () => applyFilters(allCars));
})();
