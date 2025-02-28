const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Endpoint para manejar las acciones del Frame
app.post('/frame-action', (req, res) => {
  const { buttonIndex } = req.body;

  // Lógica para el botón "Siguiente"
  if (buttonIndex === 1) {
    res.json({
      type: 'frame',
      image: 'https://e0.pxfuel.com/wallpapers/284/665/desktop-wallpaper-1080x1080-pixels.jpg',
      buttons: [
        {"label": "Siguiente", "action": "post"},
        {"label": "Anterior", "action": "post"}
      ]
    });
  }
  // Lógica para el botón "Anterior"
  else if (buttonIndex === 2) {
    res.json({
      type: 'frame',
      image: 'https://e0.pxfuel.com/wallpapers/228/320/desktop-wallpaper-1080x1080-pixels.jpg',
      buttons: [
        {"label": "Siguiente", "action": "post"},
        {"label": "Anterior", "action": "post"}
      ]
    });
  }
  // Si el botón no es válido
  else {
    res.status(400).send('Acción no válida');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});