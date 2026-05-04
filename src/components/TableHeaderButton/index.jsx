import { Box, Grid } from "@material-ui/core";
import CustomButton from "../CustomButton/CustomButton";

export default function TableHeaderButton({
  text = "",
  onClick = () => null,
  Icon = () => null,
  color = "purple",
  sm = 2,
  disabled = false,
  hasPermission = true,
}) {
  if (!hasPermission) return null;

  return (
    <Grid item xs={12} sm={sm}>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CustomButton color={color} onClick={onClick} disabled={disabled}>
          <Box display="flex" alignItems="center">
            <Icon />
            {text}
          </Box>
        </CustomButton>
      </Box>
    </Grid>
  );
}
