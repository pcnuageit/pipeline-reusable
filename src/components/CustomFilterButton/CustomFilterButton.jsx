import {
  Box,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { APP_CONFIG } from "../../constants/config";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: APP_CONFIG.mainCollors.primary,
    display: "flex",
    flexDirection: "column",
    /* height: '50px', */
    padding: "5px",
    marginRight: "5px",
    borderRadius: "27px",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
    },
  },
}));

const CustomFilterButton = ({ title, ...rest }) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box className={classes.root}>
      <Typography
        style={{
          fontFamily: "Montserrat-Regular",
          fontSize: "13px",
          color: "white",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default CustomFilterButton;
