import express, { NextFunction, Request, Response } from 'express';
import patientsService from '../services/patientsService';
import { NewPatientEntry, Patient } from '../types';
import { NewPatientSchema } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<Patient[]>) => {
  //res.send(patientsService.getNonSsnEntries());
  res.send(patientsService.getEntries());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send(patientsService.patientDetail(id));
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
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

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
  const addedEntry = patientsService.addPatient(req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;