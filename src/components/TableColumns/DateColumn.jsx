import { Box, Typography } from "@material-ui/core";

const DateColumn = ({ date }) => {
  // const newDate = new Date(date);
  // const option = {
  //   year: "numeric",
  //   month: "numeric",
  //   day: "numeric",
  // };
  // const formatedDate = newDate.toLocaleDateString("pt-br", option);
  // return (
  //   <Box display="flex" justifyContent="center">
  //     <Typography style={{ marginLeft: "6px" }}>{formatedDate}</Typography>
  //   </Box>
  // );

  if (!date) return <Typography>-</Typography>;

  const p = date.split(/\D/g);
  const dataFormatada = [p[2], p[1], p[0]].join("/");
  return (
    <Box display="flex" justifyContent="center">
      <Typography style={{ marginLeft: "6px" }}>{dataFormatada}</Typography>
    </Box>
  );
};

export default DateColumn;
