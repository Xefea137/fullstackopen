"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewPatientSchema = exports.NewEntrySchemaWithoutId = exports.NewEntrySchema = exports.DiagnosisSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("./types");
exports.DiagnosisSchema = zod_1.z.object({
    code: zod_1.z.string(),
    name: zod_1.z.string(),
    latin: zod_1.z.string().optional()
});
const BaseEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    description: zod_1.z.string(),
    date: zod_1.z.string().date(),
    specialist: zod_1.z.string(),
    diagnosisCodes: zod_1.z.array(zod_1.z.string()).optional(),
});
const HealthCheckEntrySchema = BaseEntrySchema.extend({
    type: zod_1.z.literal("HealthCheck"),
    healthCheckRating: zod_1.z.nativeEnum(types_1.HealthCheckRating)
});
const SickLeaveSchema = zod_1.z.object({
    startDate: zod_1.z.string().date().optional(),
    endDate: zod_1.z.string().date().optional()
});
const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
    type: zod_1.z.literal("OccupationalHealthcare"),
    employerName: zod_1.z.string(),
    sickLeave: SickLeaveSchema.optional()
});
const DischargeSchema = zod_1.z.object({
    date: zod_1.z.string().date(),
    criteria: zod_1.z.string()
});
const HospitalEntrySchema = BaseEntrySchema.extend({
    type: zod_1.z.literal("Hospital"),
    discharge: DischargeSchema
});
exports.NewEntrySchema = zod_1.z.union([
    HealthCheckEntrySchema,
    OccupationalHealthcareEntrySchema,
    HospitalEntrySchema
]);
exports.NewEntrySchemaWithoutId = zod_1.z.union([
    HealthCheckEntrySchema.omit({ id: true }),
    OccupationalHealthcareEntrySchema.omit({ id: true }),
    HospitalEntrySchema.omit({ id: true }),
]);
exports.NewPatientSchema = zod_1.z.object({
    name: zod_1.z.string(),
    dateOfBirth: zod_1.z.string().date(),
    ssn: zod_1.z.string(),
    gender: zod_1.z.nativeEnum(types_1.Gender),
    occupation: zod_1.z.string(),
    entries: zod_1.z.array(exports.NewEntrySchema).default([])
});
