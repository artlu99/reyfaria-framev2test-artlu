export default function handler(req, res) {
  if (req.method === "POST") {
    const { buttonIndex } = req.body;

    if (buttonIndex === 1) {
      return res.status(200).json({
        message: "Botón 1 presionado correctamente",
      });
    }

    return res.status(200).json({
      message: "Acción recibida pero sin un botón específico",
    });
  }

  return res.status(404).json({ error: "Endpoint no encontrado" });
}
