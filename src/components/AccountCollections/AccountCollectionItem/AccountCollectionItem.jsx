import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_CONFIG } from "../../../constants/config";

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    borderRadius: 27,
    margin: "16px",
    padding: "12px",
    /* alignItems: 'center', */
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    color: "#35322f",
    transition: `${theme.transitions.create(["background-color", "transform"], {
      duration: theme.transitions.duration.standard,
    })}`,
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary.light,
      transform: "scale(1.05)",
      color: "white",
    },
    width: "220px",
    height: "120px",
    animation: `$myEffect 500ms ${theme.transitions.easing.easeInOut}`,
    [theme.breakpoints.down("md")]: {
      width: "170px",
      height: "100px",
      margin: "16px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100px",
      height: "110px",
      margin: "6px",
    },
  },
  "@keyframes myEffect": {
    "0%": {
      opacity: 1,
      transform: "translateX(20%)",
    },
    "100%": {
      opacity: 1,
      transform: "translateX(0)",
    },
  },

  textImageContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Montserrat-Regular",
    marginTop: "3px",
    fontSize: "0.7rem",
    fontWeight: "400",
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
      fontWeight: "500",
    },
  },

  textContainer: {
    display: "flex",
    fontFamily: "Montserrat-Regular",
    marginLeft: "24px",
    fontSize: "0.7rem",
    fontWeight: "400",
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
      fontWeight: "500",
      flexDirection: "column",
    },
  },
}));

const AccountCollectionItem = ({
  typographyStyle,
  icon,
  link,
  text,
  ...rest
}) => {
  const classes = useStyles();
  const { section } = useParams();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box display="flex">
      <Box
        onClick={
          link === null
            ? () =>
                toast.warning("Sem permissão para acessar essa funcionalidade")
            : null
        }
        /* boxShadow={3} */
        className={classes.iconContainer}
        component={Link}
        to={link === null ? section : link}
        {...rest}
        style={{ flexDirection: matches ? "column" : "row" }}
      >
        <FontAwesomeIcon
          icon={icon}
          color={APP_CONFIG.mainCollors.primary}
          size={matches ? "2x" : "3x"}
        />

        <Typography
          style={{ fontSize: matches ? 12 : 15 }}
          variant="subtitle2"
          className={classes.textContainer}
          align="center"
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export default AccountCollectionItem;
