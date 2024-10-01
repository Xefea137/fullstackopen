import { useParams } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import patientService from "../../services/patients";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { useEffect, useState } from "react";
import { Diagnosis, Patient } from "../../types";
import diagnoseService from "../../services/diagnoses";
import EntryDetails from "./EntryDetails";
import DiagnosisList from "./DiagnosisList";
import NewEntryForm from "../AddEntryForm";

const PatientDetails = () => {
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams<{ id: string }>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [newEntry, setNewEntry] = useState(false);

  useEffect(() => {
    const patientData = async() => {
      const patientData = await patientService.patientInformation(id!);
      setPatient(patientData);

      const allDiagnoses = await diagnoseService.getAll();
      setDiagnoses(allDiagnoses);
    };
    void patientData();
  }, [id]);

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  const diagnoseCodes = diagnoses.map(d => d.code);

  return (
    <Container>
      <Typography variant="h3" sx={{ mt: 2, mb: 2 }}>
        {patient.name} {patient.gender === 'male' ? <MaleIcon /> : patient.gender === 'female' ? <FemaleIcon /> : <TransgenderIcon />}
      </Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Entries</Typography>
      {patient.entries.map(e => (
        <div key={e.id}>
          <EntryDetails entry={e} />
          {e.diagnosisCodes && <DiagnosisList codes={e.diagnosisCodes} diagnoses={diagnoses} />}
        </div>
      ))}
      <Button onClick={() => setNewEntry(true)} variant='contained' color='primary' type='submit' sx={{ marginTop:1, marginBottom: 1 }}>Add New Entry</Button>
      {newEntry && <NewEntryForm setNewEntry={setNewEntry} setPatient={setPatient} id={id!} patient={patient} diagnoseCodes={diagnoseCodes} />}
    </Container>
  );
};

export default PatientDetails;