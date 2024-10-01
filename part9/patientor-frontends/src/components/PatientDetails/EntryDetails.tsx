import { Entry, HealthCheckRating } from '../../types';
import { Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';

const assertNever = (value: never) => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const Color = (rating: HealthCheckRating) => {
  return rating === 0 ? 'green' : rating === 1 ? 'yellow' : rating === 2 ? 'orange' : 'red';
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return (
        <Box component="section" sx={{ p: 2, border: '1px solid black', borderRadius: 2, mb: 2 }}>
          {entry.date} <MedicalServicesIcon />
          <Typography sx={{ fontStyle: 'italic' }}>{entry.description}</Typography>
          <div><FavoriteIcon sx={{ color: Color(entry.healthCheckRating) }} /></div>
          <div>Diagnosed by {entry.specialist}</div>
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box component="section" sx={{ p: 2, border: '1px solid black', borderRadius: 2, mb: 2 }}>
          {entry.date} <WorkIcon /> {entry.employerName}
          <Typography sx={{ fontStyle: 'italic' }}>{entry.description}</Typography>
          <div>Diagnosed by {entry.specialist}</div>
        </Box>
      );
    case "Hospital":
      return (
        <Box component="section" sx={{ p: 2, border: '1px solid black', borderRadius: 2, mb: 2 }}>
          {entry.date} <LocalHospitalIcon />
          <Typography sx={{ fontStyle: 'italic' }}>{entry.description}</Typography>
          <div>{entry.discharge.date} {entry.discharge.criteria}</div>
          <div>Diagnosed by {entry.specialist}</div>
          <div>Discharged {entry.discharge.date}: {entry.discharge.criteria}</div>
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;