export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { q, source = "auto", target = "en" } = req.body || {};

    if (!q) {
      return res.status(400).json({ error: "Missing text" });
    }

    const provider = "https://translate.argosopentech.com/translate";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(provider, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        q,
        source,
        target,
        format: "text"
      })
    });

    clearTimeout(timeout);

    const raw = await response.text();
    console.log("RAW RESPONSE:", raw);

    if (!response.ok) {
      return res.status(500).json({
        error: `Provider returned ${response.status}`,
        details: raw
      });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        error: "Invalid JSON from provider",
        raw
      });
    }

    if (!data.translatedText) {
      return res.status(500).json({
        error: "No translatedText in response",
        data
      });
    }

    return res.status(200).json({
      translated: data.translatedText
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message || "Server error"
    });
  }
}
