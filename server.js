const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Para manejar JSON en las solicitudes
app.use(express.json());

// Estado actual de la imagen (en una aplicación real, esto se almacenaría en una base de datos o sesión)
let currentImageIndex = 0;
const images = [
  "https://wallpaperaccess.com/full/1940042.jpg",
  "https://www.loscauces.com/wp-content/uploads/2024/07/IMAGENES-SEO-PORTADA-1200-x-800-px.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Lufthansa_Airbus_A380-800_D-AIMG.jpg/1200px-Lufthansa_Airbus_A380-800_D-AIMG.jpg"
];

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Permitir CORS (para evitar problemas de acceso)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta principal para el frame
app.get('/', (req, res) => {
  const totalImages = images.length;
  const currentImage = images[currentImageIndex];

  // Verificar si es una solicitud de Farcaster
  const userAgent = req.headers['user-agent'] || '';
  const isFarcasterRequest = userAgent.includes('Farcaster') || 
                            userAgent.includes('Warpcast') || 
                            req.query.validate === 'true';

  if (isFarcasterRequest) {
    // Respuesta para Farcaster
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Metadatos del Frame de Farcaster -->
        <meta property="fc:frame" content="vNext">
        <meta property="fc:frame:image" content="${currentImage}">
        <meta property="fc:frame:button:1" content="Siguiente">
        <meta property="fc:frame:button:2" content="Anterior">
        <meta property="fc:frame:post_url" content="https://framev2test.vercel.app/api/frame-action">
        
        <title>Carrusel Farcaster</title>
      </head>
      <body>
        <h1>Farcaster Frame Carousel</h1>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  // Respuesta para visitantes normales (página web completa)
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Carrusel Farcaster</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          margin: 50px auto;
          max-width: 800px;
          padding: 20px;
        }
        .carousel-container {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 30px 0;
        }
        .carousel {
          flex: 1;
          overflow: hidden;
          border: 2px solid #ddd;
          border-radius: 10px;
          position: relative;
          cursor: grab;
          user-select: none;
        }
        .carousel img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          flex-shrink: 0;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <h1>Mi Carrusel Farcaster</h1>
      <div class="carousel-container">
        <div class="carousel">
          <img src="${currentImage}" alt="Imagen ${currentImageIndex + 1}">
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Ruta para manejar las acciones del frame (botones)
app.post('/api/frame-action', (req, res) => {
  const buttonIndex = req.body?.untrustedData?.buttonIndex || 0;

  if (buttonIndex === 1) {
    // Botón "Siguiente"
    currentImageIndex = Math.min(currentImageIndex + 1, images.length - 1);
  } else if (buttonIndex === 2) {
    // Botón "Anterior"
    currentImageIndex = Math.max(currentImageIndex - 1, 0);
  }

  const currentImage = images[currentImageIndex];

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta property="fc:frame" content="vNext">
      <meta property="fc:frame:image" content="${currentImage}">
      <meta property="fc:frame:button:1" content="Siguiente">
      <meta property="fc:frame:button:2" content="Anterior">
      <meta property="fc:frame:post_url" content="https://framev2test.vercel.app/api/frame-action">
      <title>Carrusel Farcaster</title>
    </head>
    <body>
      <h1>Mi Carrusel Farcaster</h1>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Servir el archivo de manifiesto de Farcaster
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
