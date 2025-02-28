export default function handler(req, res) {
    if (req.method === 'POST') {
      const { buttonIndex } = req.body;
  
      // Lógica de respuesta según el botón presionado
      if (buttonIndex === 1) {
        return res.status(200).json({
          message: "Botón 1 presionado",
        });
      }
  
      return res.status(200).json({
        message: "Acción recibida",
      });
    }
  
    return res.status(404).json({ error: "Endpoint no encontrado" });
  }
  
