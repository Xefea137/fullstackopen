import express, { NextFunction, Request, Response } from 'express';
import patientsService from '../services/patientsService';
import { NonSsnPatientsEntry, NewPatientEntry, PatientEntry } from '../types';
import { NewEntrySchema } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSsnPatientsEntry[]>) => {
  res.send(patientsService.getNonSsnEntries());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  };
};

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<PatientEntry>) => {
  const addedEntry = patientsService.addPatient(req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;