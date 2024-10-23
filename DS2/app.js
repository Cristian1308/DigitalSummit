const validUsers = new Map(); // Almacenamos correos y datos del CSV
const boletoURL = 'boleto.png'; // URL pública del boleto de fondo
const eventDate = new Date('2024-12-02T00:00:00'); // Fecha del evento: 2 de diciembre, 2024
let boletoImageURL = ""; // Variable para almacenar la URL del boleto

// Cargar lista de correos y datos desde el CSV
window.onload = function() {
  cargarListaCorreosDesdeURL('Pruebads.csv'); // Cambia la ruta según tu estructura
  iniciarCuentaRegresiva(); // Llamar a la función para iniciar el contador regresivo
};

function cargarListaCorreosDesdeURL(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar el archivo CSV');
      return response.text();
    })
    .then(data => {
      const lines = data.split('\n');
      for (let i = 1; i < lines.length; i++) {
        const [correo, nombre, codigoQR] = lines[i].split(',').map(item => item.trim());
        if (correo && codigoQR) validUsers.set(correo, { nombre, codigoQR });
      }
      console.log('Usuarios cargados:', validUsers); // Verificar en consola
    })
    .catch(error => console.error('Error al cargar el archivo CSV:', error));
}

// Actualización para manejar el nuevo ID del botón y del input
document.getElementById('submitBtnCustom').addEventListener('click', function() {
  const emailInput = document.getElementById('emailInputCustom').value.trim(); // Usamos el nuevo ID

  if (validUsers.has(emailInput)) {
    const { codigoQR } = validUsers.get(emailInput); // Obtener datos del usuario
    generarBoleto(codigoQR); // Generar boleto con QR
    document.getElementById('message').textContent = `¡Bienvenido!`;
  } else {
    document.getElementById('message').textContent = 'Correo no encontrado.';
  }
});

// Función para generar el boleto en HTML y crear una URL temporal
function generarBoleto(qrURL) {
  const qrImg = document.getElementById('qrCode');
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrURL}`;

  // Esperar hasta que el QR se haya cargado antes de mostrar el boleto
  qrImg.onload = function () {
    document.getElementById('ticketContainer').style.display = 'flex'; // Mostrar el contenedor del boleto

    // Generar el boleto como imagen y convertirla en URL temporal
    const ticketElement = document.getElementById('ticket');
    html2canvas(ticketElement, { useCORS: true }).then(function(canvas) {
      boletoImageURL = canvas.toDataURL('image/png'); // Convertir el boleto a una URL temporal

      // Copiar la URL de la imagen al portapapeles automáticamente
      copiarURLAlPortapapeles(boletoImageURL);
      alert("El boleto ha sido generado y la URL se ha copiado al portapapeles.");
    }).catch(function(error) {
      console.error("Error al generar la imagen del boleto: ", error);
    });
  };
}

// Función para copiar la URL de la imagen al portapapeles
function copiarURLAlPortapapeles(url) {
  const tempInput = document.createElement('input');
  tempInput.value = url;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}

// Función para cerrar el boleto
document.getElementById('closeBtn').addEventListener('click', function() {
  document.getElementById('ticketContainer').style.display = 'none'; // Ocultar el boleto
});

// Función para descargar el boleto como PNG
document.getElementById('downloadBtn').addEventListener('click', function() {
  if (boletoImageURL) { // Asegurarse de que la URL esté generada
    const link = document.createElement('a');
    link.download = 'boleto.png'; // Nombre del archivo
    link.href = boletoImageURL; // Convertir el canvas a una URL de imagen
    link.click(); // Simular clic para descargar la imagen
  } else {
    console.error('La URL del boleto no está disponible.');
  }
});

// Mostrar campo para ingresar el número de teléfono
document.getElementById('whatsappBtn').addEventListener('click', function() {
  document.getElementById('phoneInput').style.display = 'block';
  document.getElementById('sendBtn').style.display = 'block'; // Mostrar el botón "Enviar"
});

// Función para enviar el enlace de WhatsApp
document.getElementById('sendBtn').addEventListener('click', function() {
  const numeroTelefono = document.getElementById('phoneInput').value;
  if (numeroTelefono) {
    const mensaje = encodeURIComponent('Aquí tienes tu entrada para el Digital Summit 2024.');
    const url = `https://wa.me/${numeroTelefono}?text=${mensaje} ${boletoImageURL}`;

    // Abrir el enlace de WhatsApp en una nueva pestaña
    window.open(url, '_blank');
  } else {
    alert('Por favor, ingrese un número de teléfono válido.');
  }
});

// Función para iniciar la cuenta regresiva
function iniciarCuentaRegresiva() {
  const countdownElement = document.getElementById('countdown');

  function actualizarCuenta() {
    const ahora = new Date();
    const tiempoRestante = eventDate - ahora; // Tiempo restante en milisegundos

    // Calcular días, horas, minutos y segundos
    const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
    const horas = Math.floor((tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

    // Actualizar el texto del contador
    countdownElement.textContent = `Faltan ${dias} días, ${horas} horas, ${minutos} minutos y ${segundos} segundos para el evento.`;

    // Si el tiempo ha terminado, detener el contador
    if (tiempoRestante < 0) {
      countdownElement.textContent = "El evento ha comenzado.";
      clearInterval(interval);
    }
  }

  // Actualizar el contador cada segundo
  const interval = setInterval(actualizarCuenta, 1000);
}
