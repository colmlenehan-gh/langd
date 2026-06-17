export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { q, source = "auto", target = "en" } = req.body;

  if (!q) {
    return res.status(400).json({ error: "Missing text (q)" });
  }

  // Lingva public instances (fallback chain)
  const endpoints = [
    "https://lingva.ml/api/v1",
    "https://lingva.thedaviddelta.com/api/v1",
    "https://translate.plausibility.cloud/api/v1"
  ];

  for (const base of endpoints) {
    try {
      const url = `${base}/${source}/${target}/${encodeURIComponent(q)}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) continue;

      const text = await response.text();

      // Lingva returns:
      // { translation: "..." }
      const data = JSON.parse(text);

      if (data?.translation) {
        return res.status(200).json({
          translated: data.translation,
          provider: base
        });
      }

    } catch (err) {
      console.error("Lingva error:", base, err.message);
      continue;
    }
  }

  return res.status(500).json({
    error: "All translation providers failed"
  });
}
