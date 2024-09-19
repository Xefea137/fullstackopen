import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import express from 'express';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res ) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters '});
  }

  if (height < 1 || weight < 1) {
    return res.status(400).json({ error: 'height and weight must be more than 0'});
  }

  const bmi = calculateBmi(height, weight);

  return res.status(200).json({
    weight,
    height,
    bmi
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = req.body;
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!body.target || !body.daily_exercises) {
    res.status(400).send({ error: 'parameters missing' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const target = Number(body.target);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const dailyExercise = (body.daily_exercises as number[]).map(Number);

  if (isNaN(target) || dailyExercise.includes(NaN)) {
    res.status(400).send({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(dailyExercise, target);

  res.send({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);  
});