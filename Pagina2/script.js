const navbar = document.querySelector(".navbar-scroll");

let ultimoScroll = 0;

window.addEventListener("scroll", () => {
  const scrollActual = window.scrollY;

  if (scrollActual > ultimoScroll && scrollActual > 100) {
    // Baja
    navbar.style.transform = "translateY(-100%)";
  } else {
    // Sube
    navbar.style.transform = "translateY(0)";
  }

  ultimoScroll = scrollActual;
});
