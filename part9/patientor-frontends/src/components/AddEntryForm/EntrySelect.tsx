import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

interface Props {
  entryType: string
  setEntryType: React.Dispatch<React.SetStateAction<string>>
}

const EntrySelect = ({ entryType, setEntryType } : Props) => {
  return (
    <>
      <FormControl>
        <FormLabel>Entry Type</FormLabel>
        <RadioGroup
          defaultValue="HealthCheck"
          row
          value={entryType}
          onChange={(event) => setEntryType(event.target.value)}
        >
          <FormControlLabel value="HealthCheck" control={<Radio />} label="Health Check" />
          <FormControlLabel value="OccupationalHealthcare" control={<Radio />} label="Occupational Healthcare" />
          <FormControlLabel value="Hospital" control={<Radio />} label="Hospital" />
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default EntrySelect;