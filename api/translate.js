export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { q, source, target } = req.body;

    if (!q || !target) {
      return res.status(400).json({ error: "Missing text or target language" });
    }

    // Call LibreTranslate (server-side, so NO CORS issues)
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: q,
        source: source || "auto",
        target: target,
        format: "text"
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "Translation service error",
        details: text
      });
    }

    const data = await response.json();

    return res.status(200).json({
      translatedText: data.translatedText
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
