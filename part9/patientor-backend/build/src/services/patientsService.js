"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const patients = patients_1.default;
const getEntries = () => {
    return patients;
};
const getNonSsnEntries = () => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};
const addPatient = (entry) => {
    const id = (0, uuid_1.v1)();
    const newPatientEntry = Object.assign(Object.assign({ id }, entry), { entries: [] });
    patients.push(newPatientEntry);
    return newPatientEntry;
};
const patientDetail = (id) => {
    return patients.find(p => p.id === id);
};
const addPatientEntry = (pId, entry) => {
    const id = (0, uuid_1.v1)();
    const newEntry = Object.assign({ id }, entry);
    const patient = patients.find(p => p.id === pId);
    //patient?.entries.push(newEntry);
    if (patient) {
        patient.entries.push(newEntry);
    }
    return newEntry;
};
exports.default = {
    getEntries,
    getNonSsnEntries,
    addPatient,
    patientDetail,
    addPatientEntry
};
