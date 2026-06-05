async function cargarArticulo() {
  const contenedor = document.querySelector("#articulo");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const response = await fetch(`http://localhost:3000/articulos/${id}`);
    if (!response.ok) throw new Error("Error: " + response.status);
    const articulo = await response.json();

    contenedor.innerHTML = `
      <h1>${articulo.titulo}</h1>
      <p><strong>Autor:</strong> ${articulo.autor}</p>
      <p><strong>Categoría:</strong> ${articulo.categoria}</p>
      <p>${articulo.descripcion}</p>
    `;
  } catch (error) {
    contenedor.innerHTML = `<p class="text-danger">No se pudo cargar el artículo.</p>`;
    console.error(error);
  }
}

cargarArticulo();
