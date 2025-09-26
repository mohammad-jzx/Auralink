const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// بروكسي لبث Flask
app.use('/video_feed', createProxyMiddleware({ target: 'http://127.0.0.1:5000', changeOrigin: true }));
app.use('/', createProxyMiddleware({ target: 'http://127.0.0.1:5000', changeOrigin: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Node proxy on http://127.0.0.1:${PORT}`));


