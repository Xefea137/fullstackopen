import patientsData from '../../data/patients';
import { PatientEntry, NonSsnPatientsEntry, NewPatientEntry } from '../types';
import { v1 as uuid } from 'uuid';

const patients: PatientEntry[] = patientsData;

const getEntries = (): PatientEntry[] => {
  return patients;
};

const getNonSsnEntries = (): NonSsnPatientsEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getEntries,
  getNonSsnEntries,
  addPatient
};