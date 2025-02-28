app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Carrusel Farcaster</title>
      <style>
        /* Copia el CSS del carrusel aquí */
      </style>
    </head>
    <body>
      <h1>Mi Carrusel Farcaster</h1>
      
      <div class="carousel-container">
        <button class="carousel-btn" id="prevButton">‹</button>
        
        <div class="carousel">
          <div class="carousel-inner" id="carouselInner">
            ${images.map((img, index) => `<img src="${img}" alt="Imagen ${index + 1}">`).join('')}
          </div>
          <div class="image-counter" id="counter">1/${images.length}</div>
        </div>
        
        <button class="carousel-btn" id="nextButton">›</button>
      </div>

      <script>
        const images = ${JSON.stringify(images)};
        const carouselInner = document.getElementById('carouselInner');
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const counter = document.getElementById('counter');
        let currentIndex = 0;

        function updateControls() {
          prevButton.disabled = currentIndex === 0;
          nextButton.disabled = currentIndex === images.length - 1;
          counter.textContent = \`\${currentIndex + 1}/\${images.length}\`;
          carouselInner.style.transform = \`translateX(-\${currentIndex * 100}%)\`;
        }

        prevButton.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateControls();
          }
        });

        nextButton.addEventListener('click', () => {
          if (currentIndex < images.length - 1) {
            currentIndex++;
            updateControls();
          }
        });

        updateControls();
      </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});
