/**
 * Vercel Serverless Function: 测试 Wikipedia 连通性
 */
export default async function handler(req, res) {
  const testUrls = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/The_Fool.jpg/300px-The_Fool.jpg',
    'https://en.wikipedia.org',
    'https://api.github.com',
  ];

  const results = await Promise.all(
    testUrls.map(async (url) => {
      const start = Date.now();
      try {
        const r = await fetch(url, { method: 'HEAD', timeout: 5000 });
        return { url, status: r.status, time: Date.now() - start };
      } catch (e) {
        return { url, error: e.message, time: Date.now() - start };
      }
    })
  );

  res.json({ results, timestamp: new Date().toISOString() });
}
