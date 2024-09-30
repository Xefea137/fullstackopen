import express, { NextFunction, Request, Response } from 'express';
import patientsService from '../services/patientsService';
import { Diagnosis, Entry, NewEntry, NewPatientEntry, Patient } from '../types';
import { NewEntrySchemaWithoutId, NewPatientSchema } from '../utils';
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
  const addedPatient = patientsService.addPatient(req.body);
  res.json(addedPatient);
});

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchemaWithoutId.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
  const id = req.params.id;
  const diagnosisCodes = parseDiagnosisCodes(req.body);
  const newEntry: NewEntry = {
    ...req.body,
    diagnosisCodes,
  };

  const addedEntry = patientsService.addPatientEntry(id, newEntry);
  //const addedEntry = patientsService.addPatientEntry(id, req.body);
  res.json(addedEntry);
});

router.use(errorMiddleware);

export default router;