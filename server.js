const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/frame-action', (req, res) => {
  const { buttonIndex } = req.body;

  if (buttonIndex === 1) {
    res.json({
      type: 'frame',
      image: 'https://www.loscauces.com/wp-content/uploads/2024/07/IMAGENES-SEO-PORTADA-1200-x-800-px.jpg',
      buttons: [
        {"label": "Siguiente", "action": "post"},
        {"label": "Anterior", "action": "post"}
      ]
    });
  } else if (buttonIndex === 2) {
    res.json({
      type: 'frame',
      image: 'https://wallpaperaccess.com/full/1940042.jpg',
      buttons: [
        {"label": "Siguiente", "action": "post"},
        {"label": "Anterior", "action": "post"}
      ]
    });
  } else {
    res.status(400).send('Acción no válida');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
