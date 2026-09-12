// Configure a server-side feed adapter URL returning { data: InstagramPost[] }.
// Account-specific Meta authentication stays in the adapter, never in the browser.
export async function GET() {
  const endpoint = process.env.INSTAGRAM_FEED_URL,
    token = process.env.INSTAGRAM_FEED_TOKEN;
  if (!endpoint) return Response.json({ status: "unconfigured", data: [] });
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:") throw new Error("HTTPS required");
    const result = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) throw new Error("Feed unavailable");
    const body = (await result.json()) as { data?: unknown[] };
    const safe = (u: unknown) =>
      typeof u === "string" && u.startsWith("https://");
    const data = (Array.isArray(body.data) ? body.data : [])
      .slice(0, 18)
      .filter(
        (p: any) =>
          safe(p.permalink) &&
          safe(p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url),
      )
      .map((p: any) => ({
        id: String(p.id),
        caption: String(p.caption || ""),
        media_url: p.media_url,
        thumbnail_url: p.thumbnail_url,
        permalink: p.permalink,
        media_type: p.media_type,
      }));
    return Response.json(
      { status: "ready", data },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  } catch {
    return Response.json({ status: "error", data: [] }, { status: 502 });
  }
}
