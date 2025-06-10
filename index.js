import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => res.send('Hello, Node.js!'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}
);