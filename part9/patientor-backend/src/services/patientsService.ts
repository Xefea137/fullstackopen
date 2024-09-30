import patientsData from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatientEntry, NewEntry, Entry } from '../types';
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
    ...entry,
    entries: [] 
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const patientDetail = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatientEntry = (pId: string, entry: NewEntry): Entry => {
  const id = uuid();
  const newEntry = {
    id,
    ...entry
  };

  const patient = patients.find(p => p.id === pId);
  
  //patient?.entries.push(newEntry);
  if (patient) {
    patient.entries.push(newEntry);
  }

  return newEntry;
};

export default {
  getEntries,
  getNonSsnEntries,
  addPatient,
  patientDetail,
  addPatientEntry
};