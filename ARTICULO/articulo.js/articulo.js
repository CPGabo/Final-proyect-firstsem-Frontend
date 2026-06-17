async function cargarArticulo() {
  const grilla = document.querySelector("#articulo");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const response = await fetch(`http://localhost:3000/articulos/${id}`);
    if (!response.ok) throw new Error("Error: " + response.status);

    const articulo = await response.json();

    grilla.innerHTML = "";

    grilla.insertAdjacentHTML(
      "beforeend",
      `
      <main class="articulo-container">
        <article class="articulo">
          <header class="articulo-header">
            <span class="categoria">${articulo.categoria}</span>
            <h1 class="titulo">${articulo.titulo}</h1>
            <div class="meta">
              <span id="meta">Por ${articulo.autor}</span>
            </div>
          </header>
          <section id="bloque-noticia">
            <div class="contenido">
              <figure class="imagen-principal">
                <img src="${articulo.imagenes[0]}" alt="Imagen del artículo" />
              </figure>
              <p>${articulo.contenido}</p>
              <h2 id="subtitulo">${articulo.subtitulo}</h2>
              <figure class="imagen-secundaria">
                <img src="${articulo.imagenes[1]}" alt="Segunda imagen" />
              </figure>
              <p>${articulo.contenido2}</p>
              <figure class="imagen-terciaria">
                <img src="${articulo.imagenes[2]}" alt="Tercera imagen" />
              </figure>
            </div>
          </section>
        </article>
      </main>
    `,
    );
  } catch (error) {
    grilla.innerHTML = `
      <div class="col-12">
        <p class="text-danger">No se pudieron cargar los artículos.</p>
      </div>
    `;
    console.error(error);
  }
}

cargarArticulo();

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
