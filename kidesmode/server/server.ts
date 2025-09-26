import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Kids Learning API server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
  console.log(`🎮 Frontend should connect to: http://localhost:${PORT}`);
});

export default app;