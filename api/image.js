/**
 * Vercel Serverless Function: 图片代理
 * Vercel 服务器访问 Wikipedia，CDN 缓存后国内可访问
 */
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'url required' });
  }

  // 只代理 Wikipedia 图片，避免安全风险
  const decodedUrl = decodeURIComponent(url);
  if (!decodedUrl.includes('wikimedia.org')) {
    return res.status(403).json({ error: 'Only wikimedia.org allowed' });
  }

  try {
    const response = await fetch(decodedUrl);
    if (!response.ok) {
      return res.status(502).json({ error: 'Upstream fetch failed' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // 设置长期缓存（图片不常变）
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('Content-Type', contentType);
    
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
