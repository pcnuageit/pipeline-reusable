import "../../fonts/Montserrat-SemiBold.otf";

import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { APP_CONFIG } from "../../constants/config";

const useStyles = makeStyles((theme) => ({
  customButton: {
    borderRadius: "37px",
    fontWeight: "bold",
    fontSize: "11px",
    width: "220px",
    height: "38px",
    boxShadow: "0px 0px 5px 0.7px grey",
    fontFamily: "Montserrat-SemiBold",
  },
}));

const CustomButton = (props) => {
  const classes = useStyles();
  const colorProp = () => {
    const color = props?.color;
    if (!color)
      return {
        backgroundColor: "white",
        color: APP_CONFIG.mainCollors.primary,
      };

    if (color === "black")
      return {
        backgroundColor: "#443D38",
        color: "white",
      };

    if (color === "yellow")
      return {
        backgroundColor: "#ffdc00",
        color: "black",
      };

    if (color === "purple")
      return {
        backgroundColor: APP_CONFIG.mainCollors.primary,
        color: "white",
      };

    if (color === "red")
      return {
        backgroundColor: "#ED757D",
        color: "white",
      };
  };

  return (
    <Button
      {...props}
      className={classes.customButton}
      variant="contained"
      style={{
        // ...(props.size === "medium" ? { width: "310px" } : { width: "320px" }),
        ...colorProp(),
        ...props?.style,
      }}
      disabled={props?.disabled || props?.loading}
    >
      {props?.loading ? (
        <CircularProgress size={22} style={{ color: colorProp()?.color }} />
      ) : null}
      {props.children}
    </Button>
  );
};

export default CustomButton;
