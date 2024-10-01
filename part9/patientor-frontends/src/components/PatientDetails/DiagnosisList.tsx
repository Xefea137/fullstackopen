import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Diagnosis } from "../../types";
import CircleIcon from '@mui/icons-material/Circle';

const DiagnosisList: React.FC<{ codes: string[]; diagnoses: Diagnosis[] }> = ({ codes, diagnoses }) => (
  <List>
    {codes.map(c => (
      <ListItem key={c} disablePadding>
        <ListItemIcon sx={{ minWidth: 0, mr: 1, ml: 2 }}>
          <CircleIcon style={{ fontSize: '0.5rem', color: 'black' }} />
        </ListItemIcon>
        <ListItemText>
          {c} {diagnoses.find(d => d.code === c)?.name}
        </ListItemText>
      </ListItem>
    ))}
  </List>
);

export default DiagnosisList;