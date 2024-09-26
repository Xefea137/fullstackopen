import patientsData from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatientEntry } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientsData;

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSsnEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = ( entry: NewPatientEntry ): Patient => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const patientDetail = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

export default {
  getEntries,
  getNonSsnEntries,
  addPatient,
  patientDetail
};