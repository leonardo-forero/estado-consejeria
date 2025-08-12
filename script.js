let consejeroEncontrado = null; // Guardará los datos del consejero si existe

async function consultar() {
  const documento = document.getElementById("documento").value;
  const resultado = document.getElementById("resultado");
  const btnCertificado = document.getElementById("btnCertificado");

  // Limpiar resultados anteriores
  resultado.innerHTML = "";
  btnCertificado.style.display = "none"; // Ocultar botón por defecto
  consejeroEncontrado = null;

  try {
    const response = await fetch("consejeros.json");
    const data = await response.json();

    // Buscar consejero
    const consejero = data.find(persona => persona["No. Documento"] == documento);

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    if (consejero) {
      consejeroEncontrado = consejero; // Guardamos datos para el PDF
      if (consejero.Estado.toLowerCase() === "activo") {
        tarjeta.innerHTML = `<span class="icono">✅</span>${consejero.Nombre} presenta consejería activa en el Sistema Distrital de Arte, Cultura y Patrimonio y podrá acceder a incentivos dirigidos a consejeras y consejeros del Sistema.`;
        reproducirSonido("activo");
      } else {
        tarjeta.innerHTML = `<span class="icono">⚠️</span>${consejero.Nombre} presenta consejería inactiva en el Sistema Distrital de Arte, Cultura y Patrimonio por trámite en curso de alguna de las causales del Artículo 62 del Decreto 480 de 2018. Por lo tanto, no podrá acceder a ningún incentivo dirigido a consejeras y consejeros del Sistema.`;
        reproducirSonido("inactivo");
      }
      btnCertificado.style.display = "inline-block"; // Mostrar botón solo si se encontró
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

// Función para generar PDF con jsPDF
function generarCertificado() {
  if (!consejeroEncontrado) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(16);
  doc.text("CERTIFICADO DE CONSEJERÍA", 105, 20, { align: "center" });

  // Nombre y documento
  doc.setFontSize(12);
  doc.text(`Nombre: ${consejeroEncontrado.Nombre}`, 20, 50);
  doc.text(`Documento: ${consejeroEncontrado["No. Documento"]}`, 20, 60);

  // Estado
  let estadoTexto = "";
  if (consejeroEncontrado.Estado.toLowerCase() === "activo") {
    estadoTexto = "Se certifica que el(a) consejero(a) se encuentra ACTIVO(a) en el Sistema Distrital de Arte, Cultura y Patrimonio.";
  } else {
    estadoTexto = "Se certifica que el(a) consejero(a) se encuentra INACTIVO(a) en el Sistema Distrital de Arte, Cultura y Patrimonio.";
  }
  doc.text(estadoTexto, 20, 80, { maxWidth: 170 });

  // Fecha
  const fecha = new Date().toLocaleDateString("es-CO");
  doc.text(`Fecha de expedición: ${fecha}`, 20, 110);

  // Guardar PDF
  doc.save(`Certificado_Consejero_${consejeroEncontrado["No. Documento"]}.pdf`);
}