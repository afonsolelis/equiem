const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Equiem API running on http://localhost:${PORT}`);
  console.log(`Swagger UI:          http://localhost:${PORT}/docs`);
});
