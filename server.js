const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Usa el puerto proporcionado por Vercel

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Endpoint para manejar las acciones del Frame
app.post('/frame-action', (req, res) => {
  const { buttonIndex } = req.body;

  // Lógica para el botón "Siguiente"
  if (buttonIndex === 1) {
    res.json({
      type: 'frame',
      image: 'https://www.loscauces.com/wp-content/uploads/2024/07/IMAGENES-SEO-PORTADA-1200-x-800-px.jpg',
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
      image: 'https://wallpaperaccess.com/full/1940042.jpg',
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
