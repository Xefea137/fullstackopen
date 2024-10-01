import { Box, Alert, Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import axios from "axios";
import patientService from "../../services/patients";
import { useState, SyntheticEvent } from "react";
import { Patient, NewEntry, Discharge, SickLeave, HealthCheckRating } from "../../types";
import BaseEntry from "./BaseEntry";
import HealthCheckEntry from "./HealthCheckEntry";
import HospitalEntry from "./HospitalEntry";
import OccupationalHealthcareEntry from "./OccupationalHealthcareEntry";
import EntrySelect from "./EntrySelect";

interface NewEntryFormProps {
  setNewEntry: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
  patient: Patient | undefined;
  diagnoseCodes: string[]
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ setNewEntry, id, setPatient, patient, diagnoseCodes }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [diagnosticCode, setDiagnosticCode] = useState('');
  const [diagnosticCodes, setDiagnosticCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState<SickLeave | undefined>(undefined);
  const [discharge, setDischarge] = useState<Discharge>({ date: '', criteria: '' });
  const [error, setError] = useState<string>();
  const [entryType, setEntryType] = useState('');

  const newEntryData = async (event: SyntheticEvent) => {
    event.preventDefault();
    let hasError = false;

    if (!date) {
      setError("Date is required");
      hasError = true;
    }

    if (!specialist) {
      setError("Specialist is required");
      hasError = true;
    }

    if (!description) {
      setError("Description is required");
      hasError = true;
    }

    if (hasError) {
      setTimeout(() => {
        setError('');
      }, 5000);
    }
    
    if (!hasError) {
      const baseValues = {
        date,
        specialist,
        description,
        diagnosisCodes: diagnosticCodes
      };

      let values: NewEntry;

      switch (entryType) {
        case "HealthCheck":
          values = {
            ...baseValues,
            healthCheckRating: Number(healthCheckRating),
            type: "HealthCheck"
          };
          break;
        case "OccupationalHealthcare":
          values = {
            ...baseValues,
            employerName,
            sickLeave,
            type: "OccupationalHealthcare"
          };
          break;
        case "Hospital":
          values = {
            ...baseValues,
            discharge,
            type: "Hospital"
          };
          break;
        default:
          setError("Invalid entry type");
          return;
      }

      try {
        const entry = await patientService.createEntry(id, values);
        if (patient) {
          const updatedPatient = {
            ...patient,
            entries: patient.entries.concat(entry),
          };
          setPatient(updatedPatient);
        }
        setNewEntry(false);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace('Something went wrong. Error: ', '');
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    }
  };

  return (
    <Dialog open={true} onClose={() => setNewEntry(false)}>
      <DialogTitle>Add New Entry</DialogTitle>
      <DialogContent>

        <EntrySelect
          entryType={entryType}
          setEntryType={setEntryType}
        />

        {entryType && <form onSubmit={newEntryData}>
          {error && (<Alert severity="error" sx={{ margin: 2 }}>{error}</Alert>)}

          <BaseEntry
            date={date}
            setDate={setDate}
            specialist={specialist}
            setSpecialist={setSpecialist}
            description={description}
            setDescription={setDescription}
            diagnosticCode={diagnosticCode}
            setDiagnosticCode={setDiagnosticCode}
            diagnosticCodes={diagnosticCodes}
            setDiagnosticCodes={setDiagnosticCodes}
            diagnoseCodes={diagnoseCodes}
          />

          {entryType === "HealthCheck" && <HealthCheckEntry
            setHealthCheckRating={setHealthCheckRating}
            healthCheckRating={healthCheckRating}
          />}

          {entryType === "OccupationalHealthcare" && <OccupationalHealthcareEntry
            employerName={employerName}
            setEmployerName={setEmployerName}
            sickLeave={sickLeave}
            setSickLeave={setSickLeave}
          />}

          {entryType === "Hospital" && <HospitalEntry
            discharge={discharge}
            setDischarge={setDischarge}
          />}

          <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="success" >
              Add entry
            </Button>
            <Button onClick={() => setNewEntry(false)} type="button" variant="contained" color="error" >
              Cancel
            </Button>
          </Box>
        </form>}
      </DialogContent>
    </Dialog>
  );
};

export default NewEntryForm;