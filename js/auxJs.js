
const nav = document.getElementById("bottom-nav");
const toggleTab = document.getElementById("toggle-tab");

toggleTab.addEventListener("click", () => {
  nav.classList.toggle("hidden");
  toggleTab.textContent = nav.classList.contains("hidden") ? "▼" : "▲";
});


document.getElementById("nav-back").addEventListener("click", () => {
  window.history.back();
});

document.getElementById("nav-home").addEventListener("click", () => {
  alert("Pantalla minimizada (simulación)");
});


document.getElementById("nav-recent").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

