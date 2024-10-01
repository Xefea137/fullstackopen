import { InputLabel, TextField } from "@mui/material";
import { SickLeave } from "../../types";

interface Props {
  employerName: string
  setEmployerName: React.Dispatch<React.SetStateAction<string>>
  sickLeave: SickLeave | undefined
  setSickLeave: React.Dispatch<React.SetStateAction<SickLeave | undefined>>
}

const OccupationalHealthcareEntry = ({ employerName, setEmployerName,
                                        sickLeave, setSickLeave } : Props) => {
  return (
    <>
      <TextField
        sx={{ mt: 1 }}
        label="Employer Name"
        required
        type="text"
        variant="outlined"
        fullWidth
        value={employerName}
        onChange={({ target }) => setEmployerName(target.value)}
      />
      <InputLabel sx={{ mt: 1 }}>Sick leave</InputLabel>
      <InputLabel >Start</InputLabel>
      <TextField
        type="date"
        variant="outlined"
        fullWidth
        value={sickLeave?.startDate || ''}
        onChange={({ target }) => {
          const newSickLeave = { ...sickLeave, startDate: target.value };
          setSickLeave(newSickLeave.startDate || newSickLeave.endDate ? newSickLeave : undefined);
        }}
      />
      <InputLabel >End</InputLabel>
      <TextField
        type="date"
        variant="outlined"
        fullWidth
        value={sickLeave?.endDate || ''}
        onChange={({ target }) => {
          const newSickLeave = { ...sickLeave, endDate: target.value };
          setSickLeave(newSickLeave.startDate || newSickLeave.endDate ? newSickLeave : undefined);
        }}
      />
    </>
  );
};

export default OccupationalHealthcareEntry;