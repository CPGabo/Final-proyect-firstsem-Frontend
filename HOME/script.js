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

//CARDS DE ARTICULOS
async function cargarArticulos() {
  const grilla = document.querySelector("#grilla-articulos");
  try {
    const response = await fetch("http://localhost:3000/articulos");
    if (!response.ok) throw new Error("Error: " + response.status);
    const articulos = await response.json();
    // Limpiar el contenido placeholder
    grilla.innerHTML = "";
    // Generar una card por cada articulo
    for (const articulo of articulos) {
      grilla.insertAdjacentHTML(
        "beforeend",
        `
<div class="col-12 col-md-6 col-lg-6">
    <div class="rb-card h-100">
      <div class="rb-card-body">
        <span class="rb-badge">${articulo.categoria}</span>
        <h5 class="rb-title">${articulo.titulo}</h5>
        <p class="rb-desc">${articulo.descripcion}</p>
      </div>
      <div class="rb-card-footer">
        <small class="rb-autor">Por ${articulo.autor}</small>
        <a href="/Articulo/articulo.html?id=${articulo.id}" class="rb-btn">
          Leer más
        </a>
      </div>
    </div>
  </div>
  `,
      );
    }
  } catch (error) {
    grilla.innerHTML = `
<div class="col-12">
<p class="text-danger">No se pudieron cargar los artículos.</p>
</div>
`;
    console.error(error);
  }
}
// Ejecutar cuando la página cargue
cargarArticulos();

// API - CLIMA
function emojiClima(code) {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "☁️";
  if (code <= 67) return "️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "️";
  return "⚡";
}
async function cargarClima() {
  const clima = document.querySelector("#clima");
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast" +
        "?latitude=-34.9&longitude=-56.17&current_weather=true",
    );
    if (!response.ok) throw new Error("Error al obtener el clima");
    const datos = await response.json();
    const temp = datos.current_weather.temperature;
    const viento = datos.current_weather.windspeed;
    const emoji = emojiClima(datos.current_weather.weathercode);
    clima.innerHTML = `
<p class="mb-0">
${emoji} Montevideo — <strong>${temp}°C</strong>
&nbsp;|&nbsp;
💨 Viento: ${viento} km/h
</p>
`;
  } catch (error) {
    clima.innerHTML = `<p class="text-muted mb-0">Clima no
disponible.</p>`;
    console.error(error);
  }
}

cargarClima();

const form = document.querySelector("#form-contacto");
form.addEventListener("submit", (event) => {
  event.preventDefault(); // evitar que recargue la pagina
  // Leer los valores
  const nombre = document.querySelector("#nombre").value.trim();
  const email = document.querySelector("#email").value.trim();
  const tema = document.querySelector("#tema").value;
  const mensaje = document.querySelector("#mensaje").value.trim();
  // Validar
  if (!nombre || !email || !mensaje) {
    mostrarError("Todos los campos son obligatorios.");
    return;
  }
  // Usar los datos
  console.log({ nombre, email, tema, mensaje });
  mostrarExito("Gracias " + nombre + "! Tu mensaje fue enviado.");
  // Limpiar el formulario
  form.reset();
});
function mostrarError(texto) {
  const alerta = document.querySelector("#alerta");
  alerta.textContent = texto;
  alerta.className = "alert alert-danger";
}
function mostrarExito(texto) {
  const alerta = document.querySelector("#alerta");
  alerta.textContent = texto;
  alerta.className = "alert alert-success";
}
