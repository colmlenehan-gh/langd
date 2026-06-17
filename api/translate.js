export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { q, source = "auto", target = "en" } = req.body;

  const endpoints = [
    "https://libretranslate.com/translate",
    "https://translate.argosopentech.com/translate",
    "https://libretranslate.de/translate"
  ];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q,
          source,
          target,
          format: "text"
        }),
        timeout: 8000
      });

      if (!response.ok) continue;

      const data = await response.json();

      if (data?.translatedText) {
        return res.status(200).json({
          translated: data.translatedText,
          provider: url
        });
      }

    } catch (e) {
      // try next endpoint
      continue;
    }
  }

  return res.status(500).json({
    error: "All translation providers failed"
  });
}
