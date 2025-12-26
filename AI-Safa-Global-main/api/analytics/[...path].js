const { Readable } = require('stream');

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  try {
    const API_BASE = process.env.API_BASE;
    if (!API_BASE) {
      res.status(500).json({ message: 'API_BASE not configured' });
      return;
    }

    const pathParam = req.query.path;
    const tail = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || '');
    const targetUrl = `${API_BASE.replace(/\/+$/, '')}/api/analytics/${tail}`;

    const method = req.method || 'GET';
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['content-length'];

    let body;
    if (!['GET', 'HEAD'].includes(method)) {
      body = await streamToBuffer(req);
    }

    const fetchRes = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    // Pass through status and essential headers
    res.status(fetchRes.status);
    const contentType = fetchRes.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    const cacheControl = fetchRes.headers.get('cache-control');
    if (cacheControl) res.setHeader('cache-control', cacheControl);

    const buf = Buffer.from(await fetchRes.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(502).json({ message: 'Proxy error', error: String(err && err.message || err) });
  }
};


