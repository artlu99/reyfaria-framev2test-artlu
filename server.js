const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

const APP_URL = "https://framev2test.vercel.app";

// Para manejar JSON en las solicitudes
app.use(express.json());

// Estado actual de la imagen (en una aplicación real, esto se almacenaría en una base de datos o sesión)
let currentImageIndex = 0;
const images = [
  "https://www.interfaz.com.mx/wp-content/uploads/2020/07/600x400.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyijE4-STaj_SWO-vGJgMgazKm0J8UmeIkgA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTol1j-strWTlqsRoZ70gkaewGMb09lgxVXB3D20rnPuzYJt73-iVhOKaqgH3l_pOqNQzE&usqp=CAU"
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

    const frame = {
      version: "next",
      imageUrl: currentImage,
      button: {
        title: "Lanzar",
        action: {
          type: "launch_frame",
          name: "Carrusel Farcaster",
          url: `${APP_URL}/`,
          splashImageUrl: `${APP_URL}/splash.png`,
          splashBackgroundColor: "#f7f7f7",
        },
      },
    };

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Metadatos del Frame de Farcaster -->
        <meta property="fc:frame" content="${JSON.stringify(frame).replace(/"/g, "&quot;")}">        
        <title>Carrusel Farcaster</title>
        <script src="https://cdn.jsdelivr.net/npm/@farcaster/frame-sdk/dist/index.min.js"></script>
      </head>
      <body>
        <h1>Farcaster Frame Carousel</h1>
        <script>
          frame.sdk.actions.ready();
        </script>
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

  // Eventos de deslizamiento táctil y con mouse
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;

  const carousel = document.querySelector('.carousel');

  // Evento para iniciar el arrastre
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    carousel.style.cursor = 'grabbing';
  });

  // Evento para mover durante el arrastre
  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = startX - currentX;
    currentTranslate = -currentIndex * 100 - (diff / carousel.offsetWidth) * 100;
    carouselInner.style.transform = \`translateX(\${currentTranslate}%)\`;
  });

  // Evento para finalizar el arrastre
  carousel.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';

    const threshold = 0.2; // Sensibilidad del deslizamiento (20% del ancho de la imagen)
    const movedPercentage = Math.abs(currentTranslate + currentIndex * 100) / 100;

    if (movedPercentage > threshold) {
      if (currentTranslate < -currentIndex * 100) {
        // Deslizar a la derecha (siguiente imagen)
        if (currentIndex < images.length - 1) {
          currentIndex++;
        }
      } else {
        // Deslizar a la izquierda (imagen anterior)
        if (currentIndex > 0) {
          currentIndex--;
        }
      }
    }

    // Actualizar la posición del carrusel
    updateControls();
  });

  // Evento para evitar que el mouse salga del carrusel durante el arrastre
  carousel.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      carousel.style.cursor = 'grab';
      updateControls();
    }
  });

  // Eventos táctiles para dispositivos móviles
  carousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    currentTranslate = -currentIndex * 100 - (diff / carousel.offsetWidth) * 100;
    carouselInner.style.transform = \`translateX(\${currentTranslate}%)\`;
  });

  carousel.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    const threshold = 0.2; // Sensibilidad del deslizamiento (20% del ancho de la imagen)
    const movedPercentage = Math.abs(currentTranslate + currentIndex * 100) / 100;

    if (movedPercentage > threshold) {
      if (currentTranslate < -currentIndex * 100) {
        // Deslizar a la derecha (siguiente imagen)
        if (currentIndex < images.length - 1) {
          currentIndex++;
        }
      } else {
        // Deslizar a la izquierda (imagen anterior)
        if (currentIndex > 0) {
          currentIndex--;
        }
      }
    }

    // Actualizar la posición del carrusel
    updateControls();
  });
</script>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// Endpoint to update carousel state for web visitors
app.get("/api/update-carousel", (req, res) => {
  const index = parseInt(req.query.index, 10);
  if (!isNaN(index) && index >= 0 && index < images.length) {
    currentImageIndex = index;
  }
  res.status(200).json({ success: true, currentIndex: currentImageIndex });
});

// Handle frame actions for Farcaster
app.post("/api/frame-action", (req, res) => {
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

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// Serve .well-known directory for Farcaster verification
app.use("/.well-known", express.static(path.join(__dirname, ".well-known")));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
