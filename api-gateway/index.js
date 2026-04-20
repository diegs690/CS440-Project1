const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


app.use('/api/tasks/search', createProxyMiddleware({ 
  target: process.env.SEARCH_SERVICE_URL || 'http://localhost:3002', 
  changeOrigin: true 
}));

app.use('/api/tasks/stats', createProxyMiddleware({ 
  target: process.env.STATS_SERVICE_URL || 'http://localhost:3003', 
  changeOrigin: true 
}));


app.use('/api/tasks', createProxyMiddleware({ 
  target: process.env.TASK_SERVICE_URL || 'http://localhost:3001', 
  changeOrigin: true 
}));

app.get('/health', (req, res) => {
  res.send('API Gateway is running');
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
