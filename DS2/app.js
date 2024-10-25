const validUsers = new Map(); // Almacenamos correos y datos del CSV
const boletoURL = 'boleto.png'; // URL pública del boleto de fondo
const eventDate = new Date('2024-12-02T00:00:00'); // Fecha del evento: 2 de diciembre, 2024
let boletoImageURL = ""; // Variable para almacenar la URL del boleto

// Cargar lista de correos y datos desde el CSV
window.onload = function() {
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
document.getElementById('submitBtnCustom').addEventListener('click', function() {
  const emailInput = document.getElementById('emailInputCustom').value.trim();

  if (validUsers.has(emailInput)) {
    const { qrLink, idBoleto, nombre } = validUsers.get(emailInput);
    generarBoleto(qrLink, idBoleto, nombre);
    document.getElementById('message').textContent = `¡Bienvenido, ${nombre}! Tu boleto ID: ${idBoleto}`;
  } else {
    document.getElementById('message').textContent = 'Correo no encontrado.';
  }
});

function generarBoleto(qrURL, idBoleto, nombre) {
  const qrImg = document.getElementById('qrCode');
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrURL}`;

  qrImg.onload = function () {
    document.getElementById('ticketContainer').style.display = 'flex';

    const ticketElement = document.getElementById('ticket');
    html2canvas(ticketElement, { useCORS: true }).then(function(canvas) {
      boletoImageURL = canvas.toDataURL('image/png');
    });
  };
}

//hola
// Función para cerrar el boleto
document.getElementById('closeBtn').addEventListener('click', function() {
  document.getElementById('ticketContainer').style.display = 'none'; // Ocultar el boleto
});




