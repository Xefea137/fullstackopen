import { z } from "zod";
import { NewEntrySchema } from "./utils";

export interface DiagnoseEntry {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

export type NonSsnPatientsEntry = Omit<PatientEntry, 'ssn'>;

export type NewPatientEntry = z.infer<typeof NewEntrySchema>;