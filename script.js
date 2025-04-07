async function consultar() {
  const documento = document.getElementById("documento").value;
  const resultado = document.getElementById("resultado");

  try {
    const response = await fetch("consejeros.json");
    const data = await response.json();

    const consejero = data.find(persona => persona.numero_documento == documento);

    if (consejero) {
      if (consejero.estado.toLowerCase() === "activo") {
        resultado.textContent = `✅ ${consejero.nombre} se encuentra activo en el Sistema Distrital de Arte, Cultura y Patrimonio, ya tiene tarjeta personalizada y podrá reclamar sus pasajes para la vigencia 2024 en las fechas establecidas.`;
      } else {
        resultado.textContent = `⚠️ ${consejero.nombre} se encuentra inactivo en el Sistema Distrital de Arte, Cultura y Patrimonio por trámite en curso de alguna de las causales del Artículo 62 del Decreto 480 de 2018, por tanto, no podrá acceder al apoyo de movilidad.`;
      }
    } else {
      resultado.textContent = "❌ No se encontró un consejero con ese número de documento.";
    }

  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    resultado.textContent = "Ocurrió un error al cargar la base de datos.";
  }
}