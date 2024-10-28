const validUsers = new Map(); // Almacenamos correos y datos del CSV
const boletoURL = 'boleto.png'; // URL pública del boleto de fondo
const eventDate = new Date('2024-12-02T00:00:00'); // Fecha del evento: 2 de diciembre, 2024
let boletoImageURL = ""; // Variable para almacenar la URL del boleto

// Cargar lista de correos y datos desde el CSV
window.onload = function () {
  cargarListaCorreosDesdeURL('https://script.google.com/macros/s/AKfycbwfZ9_mgpZnEsDX_07U4U0c3Gp752UIkrXdyr3OkYBnBotsWCmBZ5uMZbWLwB5GsUw6-A/exec'); // Reemplaza con el enlace de tu Apps Script
  iniciarCuentaRegresiva();
};

function cargarListaCorreosDesdeURL(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar los datos');
      return response.json();
    })
    .then(users => {
      users.forEach(user => {
        const { email, nombre, qrLink, idBoleto } = user;
        if (email && qrLink) validUsers.set(email, { nombre, qrLink, idBoleto });
      });
      console.log('Usuarios cargados:', validUsers);
    })
    .catch(error => console.error('Error al cargar los datos:', error));
}

// Manejador de evento para buscar el correo y mostrar el boleto
// document.getElementById('submitBtnCustom').addEventListener('click', function () {
//   const emailInput = document.getElementById('emailInputCustom').value.trim();

//   if (validUsers.has(emailInput)) {
//     const { qrLink, idBoleto, nombre } = validUsers.get(emailInput);
//     generarBoleto(qrLink, idBoleto, nombre);
//     document.getElementById('message').textContent = `¡Bienvenido, ${nombre}! Tu boleto ID: ${idBoleto}`;
//   } else {
//     document.getElementById('message').textContent = 'Correo no encontrado.';
//   }
// });

document.addEventListener('DOMContentLoaded', function () {
  const checkbox = document.getElementById('consentCheckbox');
  const submitButton = document.getElementById('submitBtnCustom');

  // Habilitar o deshabilitar el botón según el estado del checkbox

  submitButton.disabled = true;


  checkbox.addEventListener('change', function () {
    submitButton.disabled = !checkbox.checked; // Activa o desactiva el botón
  });

  // Lógica para manejar el clic en el botón "Enviar"
  submitButton.addEventListener('click', function () {
    const emailInput = document.getElementById('emailInputCustom').value.trim();

    // Verifica si el checkbox está marcado antes de continuar
    // if (!checkbox.checked) {
    //   document.getElementById('message').textContent = 'Debes aceptar los términos y condiciones para continuar.';
    //   return; 
    // }

    // Aquí va la lógica de validación del correo
    if (validUsers.has(emailInput)) {
      const { qrLink, idBoleto, nombre } = validUsers.get(emailInput);
      generarBoleto(qrLink, idBoleto, nombre);
      // document.getElementById('message').textContent = `¡Bienvenido, ${nombre}! Tu boleto ID: ${idBoleto}`;
    } else {
      // document.getElementById('message').textContent = 'Correo no encontrado.';
    }
  });
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
    const link = document.createElement('a');
    link.download = 'boleto.png'; // Nombre del archivo
    link.href = boletoImageURL; // Convertir el canvas a una URL de imagen
    link.click(); // Simular clic para descargar la imagen
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


