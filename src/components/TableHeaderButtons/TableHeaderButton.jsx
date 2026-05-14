import { Box, Grid } from "@material-ui/core";
import CustomButton from "../CustomButton/CustomButton";

export default function TableHeaderButton({
  text = "",
  onClick = () => null,
  Icon = () => null,
  color = "purple",
  ...props
}) {
  return (
    <Grid item xs={12} sm={2}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CustomButton color={color} onClick={onClick} {...props}>
          <Box display="flex" alignItems="center">
            <Icon />
            {text}
          </Box>
        </CustomButton>
      </Box>
    </Grid>
  );
}
