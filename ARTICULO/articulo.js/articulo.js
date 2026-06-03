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
<div class="col-12 col-md-6 col-lg-4">
<div class="card h-100">
<div class="card-body">
<span class="badge bg-secondary

mb-2">${articulo.categoria}</span>

<h5 class="card-title">${articulo.titulo}</h5>
<p class="card-text text-muted">${articulo.descripcion}</p>
</div>
<div class="card-footer d-flex justify-content-between

align-items-center">

<small class="text-muted">Por ${articulo.autor}</small>
<a href="articulo.html?id=${articulo.id}" class="btn btn-sm

btn-outline-dark">
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
