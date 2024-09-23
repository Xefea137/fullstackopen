import express, { Response } from 'express';
import diagnosesService from '../services/diagnosesService';
import { DiagnoseEntry } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<DiagnoseEntry[]>) => {
  res.send(diagnosesService.getEntries());
});

export default router;