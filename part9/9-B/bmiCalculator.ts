interface BmiValues {
  ht: number;
  wt: number;
}

const parseArgumentsBmi = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  const ht = Number(args[2]);
  const wt= Number(args[3]);

  if (isNaN(ht) || isNaN(wt)) {
    throw new Error('Provided values are not numbers!');
  }
  if (ht < 1 || wt < 1) {
    throw new Error('Height and weight must be more than 0');
  }
  return {
    ht,
    wt
  };
};

export const calculateBmi = (ht: number, wt: number): string => {
  const bmi = (wt * 10000) / (ht ** 2);
  if (bmi < 16) return 'Underweight (Severe thinness)';
  else if (bmi >= 16 && bmi <= 16.9) return 'Underweight (Moderate thinness)';
  else if (bmi >= 17 && bmi <= 18.4) return 'Underweight (Mild thinness)';
  else if (bmi >= 18.5 && bmi <= 24.9) return 'Normal range';
  else if (bmi >= 25 && bmi <= 29.9) return 'Overweight (Pre-obese)';
  else if (bmi >= 30 && bmi <= 34.9) return 'Obese (Class I)';
  else if (bmi >= 35 && bmi <= 39.9) return 'Obese (Class II)';
  else if (bmi >= 40) return 'Obese (Class III)';
  return 'Invalid BMI';
};

if (require.main === module ) {
  try {
    const { ht, wt} = parseArgumentsBmi(process.argv);
    console.log(calculateBmi(ht, wt));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened. ';
    if (error instanceof Error) {
      errorMessage += 'Error: ' + error.message;
    }
    console.log(errorMessage);
  } 
}