export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { q, source = "auto", target = "en" } = req.body || {};

  if (!q) {
    return res.status(400).json({ error: "Missing text" });
  }

  const src = source === "auto" ? "en" : source;

  // -----------------------------
  // 1. TRY LINGVA (best quality)
  // -----------------------------
  try {
    const lingvaUrl = `https://lingva.ml/api/v1/${src}/${target}/${encodeURIComponent(q)}`;

    const r1 = await fetch(lingvaUrl);
    if (r1.ok) {
      const d1 = await r1.json();

      if (d1?.translation) {
        return res.status(200).json({
          translated: d1.translation,
          provider: "lingva"
        });
      }
    }
  } catch (e) {
    // ignore and fallback
  }

  // -----------------------------
  // 2. FALLBACK: MYMEMORY
  // -----------------------------
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      q
    )}&langpair=${src}|${target}`;

    const r2 = await fetch(url);
    const d2 = await r2.json();

    const translated = d2?.responseData?.translatedText;

    if (translated) {
      return res.status(200).json({
        translated,
        provider: "mymemory"
      });
    }
  } catch (e) {
    // ignore
  }

  // -----------------------------
  // FAIL
  // -----------------------------
  return res.status(500).json({
    error: "All translation providers failed"
  });
}
