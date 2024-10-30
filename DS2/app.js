const validUsers = new Map(); // Almacenamos correos y datos del CSV
const boletoURL = 'boleto.png'; // URL pública del boleto de fondo
const eventDate = new Date('2024-12-02T00:00:00'); // Fecha del evento: 2 de diciembre, 2024
let boletoImageURL = null; // Variable para almacenar la URL del boleto

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
      abrirModalUnique(); // Abre el modal si el correo no se encuentra
    }
  });
});

// Función para abrir el modal único
function abrirModalUnique() {
  document.getElementById('emailNotFoundModalUnique').style.display = 'flex';
}

// Función para cerrar el modal único
function cerrarModalUnique() {
  document.getElementById('emailNotFoundModalUnique').style.display = 'none';
}

// Funciones para los botones del modal único
function hablarConSoporteUnique() {
  cerrarModalUnique();
  window.location.href = "https://soporte.tuempresa.com"; // URL del soporte
}

function realizarCompraUnique() {
  cerrarModalUnique();
  window.location.href = "https://compras.tuempresa.com"; // URL de la página de compra
}

// Función para generar el boleto en HTML y crear una URL temporal en formato PNG
function generarBoleto(qrURL, idBoleto, nombre, ) {
  const qrImg = document.getElementById('qrCode');
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrURL}`;

  // Esperar hasta que el QR se haya cargado antes de mostrar el boleto
  qrImg.onload = function () {
    document.getElementById('ticketContainer').style.display = 'flex'; // Mostrar el contenedor del boleto

    // Obtener el elemento contenedor del boleto
    const ticketElement = document.getElementById('ticket');

    // Cambiar el fondo del boleto según el tipo de idBoleto
    switch (idBoleto) {
      case 'p':
        ticketElement.style.backgroundImage = "url('preferencial.png')";
        break;
      case 'g':
        ticketElement.style.backgroundImage = "url('general.png')";
        break;
      case 'd':
        ticketElement.style.backgroundImage = "url('diamond.png')";
        break;
      default:
        alert("Tipo de boleto no reconocido. Verifica el ID.");
        return; // Salir si el tipo de boleto no es válido
    }

    // Insertar el nombre en el boleto, arriba del QR
    const nombreElement = document.createElement('div');
    nombreElement.innerText = nombre;
    nombreElement.style.position = 'absolute';
    nombreElement.style.top = '20%'; // Posición por encima del QR
    nombreElement.style.left = '50%';
    nombreElement.style.transform = 'translate(-50%, -50%)';
    nombreElement.style.fontSize = '1.2em';
    nombreElement.style.fontWeight = 'bold';
    nombreElement.style.color = '#FFFFFF';

    // Agregar el nombre al contenedor del boleto
    ticketElement.appendChild(nombreElement);

    // Almacenar el idBoleto como atributo de datos (oculto)
    ticketElement.setAttribute('data-id', idBoleto);

    // Generar el boleto como imagen en formato PNG y convertirla en URL temporal
    html2canvas(ticketElement, { useCORS: true, scale: 2 }).then(function (canvas) {
      boletoImageURL = canvas.toDataURL('image/png', 1.0); // Convertir el boleto a una URL temporal en PNG de alta calidad

      // Copiar la URL de la imagen al portapapeles automáticamente (opcional)
      copiarURLAlPortapapeles(boletoImageURL);
      alert("El boleto ha sido generado y ya lo puedes descargar");

    }).catch(function (error) {
      console.error("Error al generar la imagen del boleto: ", error);
    });
  };

  // Manejo de error en la carga del QR
  qrImg.onerror = function () {
    alert("Error al cargar el código QR. Verifica la URL del QR.");
  };
}

// Función para descargar el boleto como PNG
document.getElementById('downloadBtn').addEventListener('click', function () {
  if (boletoImageURL) {
    const link = document.createElement('a');
    link.download = 'boleto.png'; // Nombre del archivo en formato PNG
    link.href = boletoImageURL;    // Convertir el canvas a una URL de imagen en PNG de alta calidad
    link.click();                  // Simular clic para descargar la imagen
  } else {
    alert("Primero debes generar el boleto.");
  }
});

// Función para cerrar el boleto
document.getElementById('cancelBtn').addEventListener('click', function () {
  document.getElementById('ticketContainer').style.display = 'none'; // Ocultar el boleto
});



// Mostrar campo para ingresar el número de teléfono
document.getElementById('whatsappBtn').addEventListener('click', function () {
  document.getElementById('phoneInput').style.display = 'block';
  document.getElementById('sendBtn').style.display = 'block'; // Mostrar el botón "Enviar"
});

// Función para enviar el enlace de WhatsApp
document.getElementById('sendBtn').addEventListener('click', function () {
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