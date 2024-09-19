interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number
}

interface ExerciseData {
  target: number;
  dailyExercise: number[]
}

const parseArgumentsExercise = (args: string[]): ExerciseData => {
  if (args.length < 4) throw new Error('Not enough arguments!');
  
  const target = Number(args[2]);
  const dailyExercise = args.slice(3).map(h => Number(h));
  if (isNaN(target)) {
    throw new Error('Provided value for target is not a number');
  } else if (dailyExercise.includes(NaN)) {
    throw new Error('Hours provided should be numbers');
  } else {
    return {
      target,
      dailyExercise
    };
  }
};

export const calculateExercises = (dailyExercise: number[], target: number): Result => {
  const periodLength = dailyExercise.length;
  const trainingDays = dailyExercise.filter(d => d!== 0).length;
  const totalHours = dailyExercise.reduce((a, c) => a + c, 0);
  const success = totalHours >= target * periodLength;
  const average = totalHours / periodLength;

  const ratings = average / target;
  let rating = null;
  let ratingDescription = '';
  if (ratings < 0.5) {
    rating = 1;
    ratingDescription = 'Need to increase exercising significantly';
  } else if (ratings >= 0.5 && ratings <= 1){
    rating = 2;
    ratingDescription = 'Not too bad but could be better';
  } else {
    rating = 3;
    ratingDescription = 'Great! Exercising more than the set target';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const { target, dailyExercise } = parseArgumentsExercise(process.argv);
  console.log(calculateExercises(dailyExercise, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened. ';
  if (error instanceof Error) {
    errorMessage += 'Error: ' + error.message;
  }
  console.log(errorMessage);  
}