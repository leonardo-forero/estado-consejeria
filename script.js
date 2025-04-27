async function consultar() {
  const documento = document.getElementById("documento").value;
  const resultado = document.getElementById("resultado");

  // Limpiamos cualquier contenido anterior
  resultado.innerHTML = "";

  try {
    const response = await fetch("consejeros.json");
    const data = await response.json();

    // Cambiamos aquí para usar la clave correcta del JSON
    const consejero = data.find(persona => persona["No. Documento"] == documento);

    // Crear la tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    if (consejero) {
      if (consejero.Estado.toLowerCase() === "activo") {
        tarjeta.innerHTML = `<span class="icono">✅</span>${consejero.Nombre} presenta consejería activa en el Sistema Distrital de Arte, Cultura y Patrimonio y podrá acceder a incentivos dirigidos a consejeras y consejeros del Sistema.`;
        reproducirSonido("activo");
      } else {
        tarjeta.innerHTML = `<span class="icono">⚠️</span>${consejero.Nombre} presenta consejería inactiva en el Sistema Distrital de Arte, Cultura y Patrimonio por trámite en curso de alguna de las causales del Artículo 62 del Decreto 480 de 2018, por tanto, no podrá acceder a ningún incentivo dirigido a consejeras y consejeros del Sistema.`;
        reproducirSonido("inactivo");
      }
    } else {
      tarjeta.innerHTML = `<span class="icono">❌</span>Su documento no hace parte de la base de datos de consejeros del Sistema Distrital de Arte, Cultura y Patrimonio.`;
      reproducirSonido("no-encontrado");
    }

    resultado.appendChild(tarjeta);

  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    resultado.textContent = "Ocurrió un error al cargar la base de datos.";
  }
}

function reproducirSonido(tipo) {
  let audio;
  if (tipo === "activo") {
    audio = new Audio("sonido_activo.mp3");
  } else if (tipo === "inactivo") {
    audio = new Audio("sonido_inactivo.mp3");
  } else {
    audio = new Audio("sonido_error.mp3");
  }
  audio.play();
}