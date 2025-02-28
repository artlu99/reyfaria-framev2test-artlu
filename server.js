const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// For parsing application/json
app.use(express.json());

// Current image state - in a real app, this would be stored in a database or session
let currentImageIndex = 0;
const images = [
  "https://wallpaperaccess.com/full/1940042.jpg",
  "https://www.loscauces.com/wp-content/uploads/2024/07/IMAGENES-SEO-PORTADA-1200-x-800-px.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Lufthansa_Airbus_A380-800_D-AIMG.jpg/1200px-Lufthansa_Airbus_A380-800_D-AIMG.jpg"
];

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the main frame with proper frame tags for Farcaster
app.get('/', (req, res) => {
  const totalImages = images.length;
  const currentImage = images[currentImageIndex];
  
  // Check if this is a likely Farcaster validator request by looking at the user agent
  const userAgent = req.headers['user-agent'] || '';
  const isFarcasterRequest = userAgent.includes('Farcaster') || 
                            userAgent.includes('Warpcast') || 
                            req.query.validate === 'true';
  
  if (isFarcasterRequest) {
    // For Farcaster requests, return minimal HTML with just the frame meta tags
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
  
  // For regular web visitors, return the full interactive carousel
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
      <meta property="fc:frame:post_url" content="https://framev2test.vercel.app/api/frame-action">
      
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
        .carousel-inner {
          display: flex;
          transition: transform 0.5s ease;
        }
        .carousel img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          flex-shrink: 0;
          pointer-events: none;
        }
        .carousel-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 15px 25px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 24px;
          transition: all 0.3s ease;
        }
        .carousel-btn:hover {
          background: #357abd;
          transform: scale(1.1);
        }
        .carousel-btn:disabled {
          background: #cccccc;
          cursor: not-allowed;
          transform: none;
        }
        .image-counter {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .show-counter {
          opacity: 1;
        }
      </style>
    </head>
    <body>
      <h1>Mi Carrusel Farcaster</h1>
      
      <div class="carousel-container">
        <button class="carousel-btn" id="prevButton" ${currentImageIndex === 0 ? 'disabled' : ''}>‹</button>
        
        <div class="carousel">
          <div class="carousel-inner" style="transform: translateX(-${currentImageIndex * 100}%)">
            ${images.map((img, index) => `<img src="${img}" alt="Imagen ${index + 1}">`).join('')}
          </div>
          <div class="image-counter" id="counter">${currentImageIndex + 1}/${totalImages}</div>
        </div>
        
        <button class="carousel-btn" id="nextButton" ${currentImageIndex === totalImages - 1 ? 'disabled' : ''}>›</button>
      </div>

      <script>
        const carouselInner = document.querySelector('.carousel-inner');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const counter = document.getElementById('counter');
        const images = document.querySelectorAll('.carousel img');
        const totalImages = ${totalImages};
        let currentIndex = ${currentImageIndex};

        // Actualizar estado inicial
        updateControls();

        function updateControls() {
          // Actualizar botones
          prevButton.disabled = currentIndex === 0;
          nextButton.disabled = currentIndex === totalImages - 1;
          
          // Actualizar contador
          counter.textContent = \`\${currentIndex + 1}/\${totalImages}\`;
          
          // Mostrar y ocultar contador
          counter.classList.add('show-counter');
          setTimeout(() => {
            counter.classList.remove('show-counter');
          }, 2000); // Desaparece después de 2 segundos
          
          // Mover carrusel
          carouselInner.style.transform = \`translateX(-\${currentIndex * 100}%)\`;
        }

        // Eventos de botones
        nextButton.addEventListener('click', () => {
          if (currentIndex < totalImages - 1) {
            currentIndex++;
            updateControls();
            
            // Update server state (optional)
            fetch('/api/update-carousel?index=' + currentIndex, { method: 'GET' });
          }
        });

        prevButton.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateControls();
            
            // Update server state (optional)
            fetch('/api/update-carousel?index=' + currentIndex, { method: 'GET' });
          }
        });

        // Eventos de deslizamiento táctil
        let touchStartX = 0;
        let touchEndX = 0;
        const carousel = document.querySelector('.carousel');

        carousel.addEventListener('touchstart', e => {
          touchStartX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchmove', e => {
          touchEndX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', () => {
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 50) { // Sensibilidad del deslizamiento
            if (diff > 0 && currentIndex < totalImages - 1) {
              currentIndex++; // Deslizar a la derecha
            } else if (diff < 0 && currentIndex > 0) {
              currentIndex--; // Deslizar a la izquierda
            }
            updateControls();
            
            // Update server state (optional)
            fetch('/api/update-carousel?index=' + currentIndex, { method: 'GET' });
          }
        });

        // Eventos de deslizamiento con mouse (para pruebas en escritorio)
        let isDragging = false;
        let mouseStartX = 0;
        let mouseEndX = 0;

        carousel.addEventListener('mousedown', e => {
          isDragging = true;
          mouseStartX = e.clientX;
          carousel.style.cursor = 'grabbing'; // Cambia el cursor al arrastrar
        });

        carousel.addEventListener('mousemove', e => {
          if (isDragging) {
            mouseEndX = e.clientX;
          }
        });

        carousel.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab'; // Restaura el cursor
            const diff = mouseStartX - mouseEndX;
            if (Math.abs(diff) > 50) { // Sensibilidad del deslizamiento
              if (diff > 0 && currentIndex < totalImages - 1) {
                currentIndex++; // Deslizar a la derecha
              } else if (diff < 0 && currentIndex > 0) {
                currentIndex--; // Deslizar a la izquierda
              }
              updateControls();
              
              // Update server state (optional)
              fetch('/api/update-carousel?index=' + currentIndex, { method: 'GET' });
            }
          }
        });

        carousel.addEventListener('mouseleave', () => {
          if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab'; // Restaura el cursor si el mouse sale del carrusel
          }
        });

        // Evitar la selección de texto/imágenes durante el arrastre
        carousel.addEventListener('selectstart', e => {
          e.preventDefault(); // Evita la selección de texto/imágenes
        });
      </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Endpoint to update carousel state for web visitors
app.get('/api/update-carousel', (req, res) => {
  const index = parseInt(req.query.index, 10);
  if (!isNaN(index) && index >= 0 && index < images.length) {
    currentImageIndex = index;
  }
  res.status(200).json({ success: true, currentIndex: currentImageIndex });
});

// Handle frame actions for Farcaster
app.post('/api/frame-action', (req, res) => {
  // Get the button index that was clicked (1-based)
  const buttonIndex = req.body?.untrustedData?.buttonIndex || 0;
  
  // Update the current index based on button click
  if (buttonIndex === 1) {
    // "Siguiente" button
    currentImageIndex = Math.min(currentImageIndex + 1, images.length - 1);
  } else if (buttonIndex === 2) {
    // "Anterior" button
    currentImageIndex = Math.max(currentImageIndex - 1, 0);
  }
  
  // Get the current image
  const currentImage = images[currentImageIndex];
  
  // Build the response HTML
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

// Serve .well-known directory for Farcaster verification
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
