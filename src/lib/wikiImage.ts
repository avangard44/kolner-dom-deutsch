const WIKI_CACHE_KEY = "almanca_wiki_image_cache_v1";

function getWikiCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(WIKI_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setWikiCache(term: string, url: string) {
  if (typeof window === "undefined") return;
  try {
    const cache = getWikiCache();
    cache[term] = url;
    localStorage.setItem(WIKI_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchWikiImage(
  wikiSearchTerm: string
): Promise<string | null> {
  if (!wikiSearchTerm || typeof window === "undefined") return null;

  const cache = getWikiCache();
  if (cache[wikiSearchTerm] !== undefined) {
    return cache[wikiSearchTerm] || null;
  }

  const encoded = encodeURIComponent(wikiSearchTerm.trim());

  // Try English Wikipedia REST summary first, then German Wikipedia REST summary
  const endpoints = [
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
    `https://de.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.thumbnail?.source) {
        const src: string = data.thumbnail.source;
        setWikiCache(wikiSearchTerm, src);
        return src;
      }
    } catch {
      // Try next endpoint or fallback
    }
  }

  setWikiCache(wikiSearchTerm, "");
  return null;
}

export const fetchWikiThumbnail = fetchWikiImage;
