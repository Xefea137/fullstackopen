import { Box, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";

interface Props {
  date: string
  setDate: React.Dispatch<React.SetStateAction<string>>
  specialist: string
  setSpecialist: React.Dispatch<React.SetStateAction<string>>
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
  diagnosticCode: string
  setDiagnosticCode: React.Dispatch<React.SetStateAction<string>>
  diagnosticCodes: string[]
  setDiagnosticCodes: React.Dispatch<React.SetStateAction<string[]>>
  diagnoseCodes: string[]
}

const BaseEntry = ({ date, setDate,
                      specialist, setSpecialist,
                      description, setDescription,
                      diagnosticCode, setDiagnosticCode,
                      diagnosticCodes, setDiagnosticCodes,
                      diagnoseCodes } : Props) => {

  const handleCodeSelect = (event: SelectChangeEvent) => {
    const code = event.target.value;
    if (code && !diagnosticCodes.includes(code)) {
      setDiagnosticCodes([...diagnosticCodes, code]);
    }
    setDiagnosticCode(code);
  };

  return (
    <>
      <TextField
        label="Date"
        type="date"
        variant="outlined"
        fullWidth
        value={date}
        onChange={({ target }) => setDate(target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        sx={{ mt:1 }}
        label="Specialist"
        type="text"
        variant="outlined"
        fullWidth
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
      />

      <TextField
        sx={{ mt:1 }}
        label="Description"
        type="text"
        variant="outlined"
        fullWidth
        value={description}
        onChange={({ target }) => setDescription(target.value)}
      />

      <InputLabel sx={{ mt: 1 }}>Diagnostic Code</InputLabel>
      <Select
        label="Diagnostic Code"
        fullWidth
        value={diagnosticCode}
        onChange={handleCodeSelect}
        displayEmpty
      >
        <MenuItem value="">
          <em>Select Diagnostic Code</em>
        </MenuItem>
        {diagnoseCodes.map(options => 
          <MenuItem key={options} value={options}>
            {options}
          </MenuItem>
        )}
      </Select>
      {diagnosticCodes.length > 0 && <Box>
        <InputLabel sx={{ mt: 1 }}>Added Diagnostic Codes:</InputLabel>
        {diagnosticCodes.map((code, index) => (
          <Typography key={index}>{code}</Typography>
        ))}
      </Box>}
    </>
  );
};

export default BaseEntry;