import { InputLabel, TextField } from "@mui/material";
import { Discharge } from "../../types";

interface Props {
  discharge: Discharge
  setDischarge: React.Dispatch<React.SetStateAction<Discharge>>
}

const HospitalEntry = ({ discharge, setDischarge } : Props) => {
  return (
    <>
      <InputLabel sx={{ mt: 1 }}>Discharge date</InputLabel>
      <TextField
        required
        type="date"
        variant="outlined"
        fullWidth
        value={discharge.date}
        onChange={({ target }) => setDischarge({ ...discharge, date: target.value})}
      />
      <TextField
        sx={{ mt: 1 }}
        label="Discharge criteria"
        required
        type="text"
        variant="outlined"
        fullWidth
        value={discharge.criteria}
        onChange={({ target }) => setDischarge({ ...discharge, criteria: target.value})}
      />
    </>
  );
};

export default HospitalEntry;