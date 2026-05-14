import { Box, Typography } from "@material-ui/core";

const DateTimeColumn = ({ dateTime }) => {
  if (!dateTime) return <Typography>-</Typography>;

  const p = dateTime.split(/\D/g);
  const dataFormatada = [p[2], p[1], p[0]].join("/");
  const HoraFormatada = [p[3], p[4], p[5]].join(":");
  return (
    <Box display="flex" justifyContent="center">
      <Typography style={{ marginLeft: "6px" }}>
        {dataFormatada} {HoraFormatada}
      </Typography>
    </Box>
  );
};

export default DateTimeColumn;
