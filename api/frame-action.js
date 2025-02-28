export default function handler(req, res) {
    if (req.method === "POST") {
        return res.status(200).json({ message: "Frame action ejecutada correctamente." });
    } else if (req.method === "GET") {
        return res.status(200).json({ message: "Frame action endpoint funcionando correctamente." });
    } else {
        return res.status(405).json({ error: "Método no permitido." });
    }
}
