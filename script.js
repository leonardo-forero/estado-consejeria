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

// Función para generar PDF con el formato oficial
function generarCertificado() {
  if (!consejeroEncontrado) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // ===== TÍTULO PRINCIPAL =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    "EL SUSCRITO DIRECTOR DE ASUNTOS LOCALES Y PARTICIPACIÓN DE LA SECRETARÍA DE",
    105,
    20,
    { align: "center" }
  );
  doc.text(
    "CULTURA, RECREACIÓN Y DEPORTE",
    105,
    26,
    { align: "center" }
  );

  // Espacios (3 enters)
  let y = 35;

  // ===== SUBTÍTULO =====
  doc.text("HACE CONSTAR QUE:", 105, y, { align: "center" });
  y += 15;

  // ===== PÁRRAFO 1 =====
  doc.setFont("helvetica", "normal");
  const parrafo1 =
    `${consejeroEncontrado.Nombre}, identificado(a) con cédula de ciudadanía número ${consejeroEncontrado["No. Documento"]}, ` +
    `surtió el proceso de elección popular establecido por el Sistema Distrital de Arte, Cultura y Patrimonio y fue elegido(a) como consejero(a) ` +
    `por el periodo 2023-2027, según resolución de nombramiento 551 del 28 de julio de 2023.`;
  doc.text(parrafo1, 20, y, { maxWidth: 170, align: "justify" });
  y += 30;

  // ===== PÁRRAFO 2 =====
  const estadoTexto = consejeroEncontrado.Estado.toLowerCase() === "activo" ? "ACTIVA" : "INACTIVA";
  const parrafo2 =
    `A la fecha de expedición de la presente certificación, cuenta con Consejería ${estadoTexto}, ` +
    `en los términos de lo señalado en el artículo 17 del Decreto Distrital 336 de 2022.`;
  doc.text(parrafo2, 20, y, { maxWidth: 170, align: "justify" });
  y += 20;

  // ===== PÁRRAFO 3 =====
  const fechaHoy = new Date();
  const dia = fechaHoy.getDate();
  const mes = fechaHoy.toLocaleString("es-ES", { month: "long" });
  const año = fechaHoy.getFullYear();
  const parrafo3 =
    `La anterior certificación se expide a los ${dia} días del mes de ${mes} de ${año} por solicitud del interesado(a).`;
  doc.text(parrafo3, 20, y, { maxWidth: 170, align: "justify" });
  y += 30;

  // ===== FIRMAS =====
  doc.setFont("helvetica", "bold");
  doc.text("ANDRÉS FELIPE JARA MORENO", 105, y, { align: "center" });
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.text("Director de Asuntos Locales y Participación", 105, y, { align: "center" });
  y += 7;
  doc.text("Secretaría de Cultura, Recreación y Deporte", 105, y, { align: "center" });

  // Guardar PDF
  doc.save(`Certificado_Consejero_${consejeroEncontrado["No. Documento"]}.pdf`);
}