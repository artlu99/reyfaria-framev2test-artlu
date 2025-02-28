const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// For parsing application/json
app.use(express.json());

// Current image state - in a real app, this would be stored in a database or session
let currentImageIndex = 0;
const images = [
  "https://wallpaperaccess.com/full/1940042.jpg",
  "https://www.loscauces.com/wp-content/uploads/2024/07/IMAGENES-SEO-PORTADA-1200-x-800-px.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Lufthansa_Airbus_A380-800_D-AIMG.jpg/1200px-Lufthansa_Airbus_A380-800_D-AIMG.jpg"
];

// Serve the main frame
app.get('/', (req, res) => {
  const totalImages = images.length;
  const currentImage = images[currentImageIndex];
  
  // Build HTML response with proper Frame v2 meta tags
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
      <!-- Farcaster Frame metadata -->
      <meta property="fc:frame" content="vNext">
      <meta property="fc:frame:image" content="${currentImage}">
      <meta property="fc:frame:button:1" content="Siguiente">
      <meta property="fc:frame:button:2" content="Anterior">
      <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || `http://localhost:${port}`}/api/frame-action">
      <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ currentIndex: currentImageIndex, totalImages }))}">
      
      <title>Carrusel Farcaster</title>
    </head>
    <body>
      <h1>Mi Carrusel Farcaster</h1>
      <p>Imagen ${currentImageIndex + 1} de ${totalImages}</p>
      <img src="${currentImage}" alt="Imagen ${currentImageIndex + 1}" style="max-width: 100%;">
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Handle frame actions
app.post('/api/frame-action', (req, res) => {
  // Parse the frame state
  let state;
  try {
    if (req.body?.untrustedData?.state) {
      state = JSON.parse(decodeURIComponent(req.body.untrustedData.state));
    } else {
      state = { currentIndex: 0, totalImages: images.length };
    }
  } catch (e) {
    state = { currentIndex: 0, totalImages: images.length };
  }
  
  // Get the button index that was clicked (1-based)
  const buttonIndex = req.body?.untrustedData?.buttonIndex || 0;
  
  // Update the current index based on button click
  if (buttonIndex === 1) {
    // "Siguiente" button
    currentImageIndex = Math.min(state.currentIndex + 1, images.length - 1);
  } else if (buttonIndex === 2) {
    // "Anterior" button
    currentImageIndex = Math.max(state.currentIndex - 1, 0);
  }
  
  // Build the response HTML with the updated image
  const currentImage = images[currentImageIndex];
  const totalImages = images.length;
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      
      <!-- Farcaster Frame metadata -->
      <meta property="fc:frame" content="vNext">
      <meta property="fc:frame:image" content="${currentImage}">
      <meta property="fc:frame:button:1" content="Siguiente">
      <meta property="fc:frame:button:2" content="Anterior">
      <meta property="fc:frame:post_url" content="${process.env.VERCEL_URL || `http://localhost:${port}`}/api/frame-action">
      <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify({ currentIndex: currentImageIndex, totalImages }))}">
      
      <title>Carrusel Farcaster</title>
    </head>
    <body>
      <h1>Mi Carrusel Farcaster</h1>
      <p>Imagen ${currentImageIndex + 1} de ${totalImages}</p>
      <img src="${currentImage}" alt="Imagen ${currentImageIndex + 1}" style="max-width: 100%;">
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;