import { FormHelperText, Grid, makeStyles } from "@material-ui/core";
import CurrencyInput from "react-currency-input";

export default function CustomCurrencyInput({
  label = "Pesquisar por valor",
  value = "",
  onChangeEvent = (event, maskedvalue, floatvalue) => null,
  error,
  prefix = "R$ ",
  gridSm = 4,
}) {
  const classes = useStyles();
  function errorMsg() {
    if (typeof error === "string") return error;
    if (Array.isArray(error)) return error?.join(" ");
  }

  return (
    <Grid item xs={12} sm={gridSm}>
      <div style={{ position: "relative", marginTop: "16px" }}>
        <label className={classes.label}>{label}</label>
        <div
          className={classes.outline}
          style={error ? { borderColor: "red" } : {}}
        >
          <CurrencyInput
            value={value}
            onChangeEvent={onChangeEvent}
            className={classes.input}
            decimalSeparator=","
            groupSeparator="."
            prefix={prefix}
          />
        </div>
      </div>

      {error ? (
        <FormHelperText
          style={{
            color: "red",
          }}
        >
          {errorMsg()}
        </FormHelperText>
      ) : null}
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  label: {
    color: "#15191E",
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "bold",
    position: "absolute",
    top: "-20px",
    left: "14px",
    fontSize: "0.80rem",
    pointerEvents: "none",
  },
  outline: {
    height: "45px",
    borderRadius: "27px",
    border: "1px solid",
  },
  input: {
    color: "#15191E",
    fontFamily: "Montserrat-Thin",
    fontWeight: "bold",
    fontSize: "1rem",
    width: "100%",
    height: "100%",
    padding: "0 14px",
    border: "none",
    outline: "none",
    background: "transparent",
    borderRadius: "27px",
  },
}));
