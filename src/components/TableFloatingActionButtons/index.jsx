import { Box, makeStyles } from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import CustomButton from "../CustomButton/CustomButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    right: 84,
    bottom: 20,
    display: "flex",
    flexDirection: "row-reverse",
    gap: 24,
    zIndex: 500,
  },
  btnContainer: {
    height: "100%",
    width: "100%",
  },
}));

export default function TableFloatingActionButtons({
  approveCallback = () => null,
  rejectCallback = () => null,
}) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.btnContainer}>
        <CustomButton color="purple" onClick={approveCallback}>
          <Box display="flex" alignItems="center">
            <Check />
            Aprovar
          </Box>
        </CustomButton>
      </Box>

      <Box className={classes.btnContainer}>
        <CustomButton color="red" onClick={rejectCallback}>
          <Box display="flex" alignItems="center">
            <Close />
            Rejeitar
          </Box>
        </CustomButton>
      </Box>
    </Box>
  );
}
