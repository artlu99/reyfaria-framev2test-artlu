export default function handler(req, res) {
    res.status(200).json({
      version: "vNext",
      image: "https://framev2test.vercel.app/frame-image.jpg", // Cambia esto a la URL correcta de la imagen del frame
      buttons: [
        { label: "Abrir Carrusel", action: "post", target: "https://framev2test.vercel.app/api/frame-action" }
      ],
      aspectRatio: "1.91:1"
    });
  }
  