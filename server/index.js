
import express from 'express';
import { generateGrids } from './constants.js';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('Hello, ChromaDash!');
});

app.get('/grids', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      grids: generateGrids(),
    });
  } catch (error) {
    console.error('Error while sending  grids: ', error);
  }
});

app.get('/select', (req, res) => {
  try {
    const score = req.query.score ? Number(req.query.score) : 0;
    const grid = req.query.grid;
    let updatedScore = score;

    if (grid === 'red') {
      updatedScore -= 10;
    } else if (grid === 'blue') {
      updatedScore += 10;
    }

    res.status(200).json({
      success: true,
      score: updatedScore,
    });
  } catch (error) {
    console.error('Error while sending grids: ', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
