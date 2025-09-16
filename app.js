// ------- SPA-style page switching -------
const navButtons = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");
const logo = document.getElementById("logo");

// Keep the year current
document.getElementById("year").textContent = new Date().getFullYear();

// Update active link + show page
function showPage(targetId){
  pages.forEach(p => p.classList.toggle("visible", p.id === targetId));
  navButtons.forEach(btn => {
    const isActive = btn.dataset.target === targetId;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-current", isActive ? "page" : null);
  });
  // Move keyboard focus to the new page
  const newPage = document.getElementById(targetId);
  if(newPage) newPage.focus();
}

// Click: nav buttons
navButtons.forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.target));
});

// Click: logo → home
logo.addEventListener("click", (e) => {
  // Allow anchor but prevent hash jump
  e.preventDefault();
  showPage("home");
  history.replaceState({}, "", "#home");
});

// Optional: support hash links (#home, #televisions, #about)
window.addEventListener("hashchange", () => {
  const page = (location.hash || "#home").replace("#", "");
  if (["home", "televisions", "about"].includes(page)) showPage(page);
});

// Initialize
showPage((location.hash || "#home").replace("#", "") || "home");

// ------- Placeholder data + interactivity for Televisions -------
const tvData = [
  { brand: "Aurora", model: "ECO43A", size: 43, power: 55, stars: 4.5 },
  { brand: "Kookaburra", model: "VIVA50", size: 50, power: 85, stars: 4.0 },
  { brand: "Southern", model: "OLED55S", size: 55, power: 95, stars: 5.0 },
  { brand: "Nullarbor", model: "QLED65N", size: 65, power: 120, stars: 4.0 },
  { brand: "Aurora", model: "ECO32L", size: 32, power: 38, stars: 4.5 },
  { brand: "Kangaroo", model: "UHD75K", size: 75, power: 160, stars: 3.5 },
  { brand: "Southern", model: "LED40S", size: 40, power: 48, stars: 4.5 },
];

const tbody = document.querySelector("#tvTable tbody");
const sizeFilter = document.getElementById("sizeFilter");
const sortBy = document.getElementById("sortBy");
const resetBtn = document.getElementById("resetBtn");

function sizeBucket(tv){
  if (sizeFilter.value === "<=43") return tv.size <= 43;
  if (sizeFilter.value === "44-55") return tv.size >= 44 && tv.size <= 55;
  if (sizeFilter.value === ">=56") return tv.size >= 56;
  return true;
}

function renderTable(){
  // filter
  let rows = tvData.filter(sizeBucket);

  // sort
  const key = sortBy.value;
  rows.sort((a,b)=>{
    if (key === "brand") return a.brand.localeCompare(b.brand);
    if (key === "size") return a.size - b.size;
    if (key === "power") return a.power - b.power;
    if (key === "stars") return b.stars - a.stars; // higher first
    return 0;
  });

  // draw
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.brand}</td>
      <td>${r.model}</td>
      <td>${r.size}</td>
      <td>${r.power}</td>
      <td>${"★".repeat(Math.floor(r.stars))}${r.stars%1 ? "½" : ""}</td>
    </tr>
  `).join("");
}

sizeFilter.addEventListener("change", renderTable);
sortBy.addEventListener("change", renderTable);
resetBtn.addEventListener("click", ()=>{
  sizeFilter.value = "all";
  sortBy.value = "brand";
  renderTable();
});

renderTable();
