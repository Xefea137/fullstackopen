import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { HealthCheckRating } from "../../types";

interface Props {
  healthCheckRating: HealthCheckRating
  setHealthCheckRating: React.Dispatch<React.SetStateAction<HealthCheckRating>>  
}

const HealthCheckEntry = ({ healthCheckRating, setHealthCheckRating } : Props) => {

  interface RatingOption{
    value: HealthCheckRating;
    label: string;
  }

  const ratingOptions: RatingOption[] = Object.entries(HealthCheckRating)
                                        .filter(([key]) => !isNaN(Number(key)))
                                        .map(([key, value]) => ({
                                          label: value as string,
                                          value: Number(key) as HealthCheckRating
  }));
  
  const onRatingChange = (event: SelectChangeEvent<number>) => {
    event.preventDefault();
    const value = Number(event.target.value);
    setHealthCheckRating(value as HealthCheckRating);
  };

  return (
    <>
      <InputLabel sx={{ mt: 1 }}>Healthcheck Rating</InputLabel>
      <Select
        label="Rating"
        fullWidth
        value={healthCheckRating}
        onChange={onRatingChange}
      >
      {ratingOptions.map(options => 
        <MenuItem key={options.value} value={options.value}>
          {options.label}
        </MenuItem>
      )}
      </Select>
    </>
  );
};

export default HealthCheckEntry;