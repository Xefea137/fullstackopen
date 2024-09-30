"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientsService_1 = __importDefault(require("../services/patientsService"));
const utils_1 = require("../utils");
const zod_1 = require("zod");
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    //res.send(patientsService.getNonSsnEntries());
    res.send(patientsService_1.default.getEntries());
});
router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.send(patientsService_1.default.patientDetail(id));
});
const newPatientParser = (req, _res, next) => {
    try {
        utils_1.NewPatientSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const errorMiddleware = (error, _req, res, next) => {
    if (error instanceof zod_1.z.ZodError) {
        res.status(400).send({ error: error.issues });
    }
    else {
        next(error);
    }
    ;
};
router.post('/', newPatientParser, (req, res) => {
    const addedPatient = patientsService_1.default.addPatient(req.body);
    res.json(addedPatient);
});
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        return [];
    }
    return object.diagnosisCodes;
};
const newEntryParser = (req, _res, next) => {
    try {
        utils_1.NewEntrySchemaWithoutId.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
router.post('/:id/entries', newEntryParser, (req, res) => {
    const id = req.params.id;
    const diagnosisCodes = parseDiagnosisCodes(req.body);
    const newEntry = Object.assign(Object.assign({}, req.body), { diagnosisCodes });
    const addedEntry = patientsService_1.default.addPatientEntry(id, newEntry);
    //const addedEntry = patientsService.addPatientEntry(id, req.body);
    res.json(addedEntry);
});
router.use(errorMiddleware);
exports.default = router;
