import app from './api/index.js';
const port = 7070;
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
