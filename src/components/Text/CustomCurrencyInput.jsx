import { makeStyles, Typography } from "@material-ui/core";
import CurrencyInput from "react-currency-input";
import CustomFormHelperText from "./CustomFormHelperText";

const useStyles = makeStyles((theme) => ({
  currency: {
    font: "inherit",
    color: "currentColor",
    width: "100%",
    border: "0px",
    borderBottom: "1px solid gray",
    height: "1.1876em",
    margin: 0,
    display: "block",
    padding: "6px 0 7px",
    minWidth: 0,
    background: "none",
    boxSizing: "content-box",
    animationName: "mui-auto-fill-cancel",
    letterSpacing: "inherit",
    animationDuration: "10ms",
    appearance: "textfield",
    textAlign: "start",
    paddingLeft: "5px",
  },
}));

const CustomCurrencyInput = ({
  value,
  onChangeEvent,
  prefix,
  suffix,
  precision,
  label,
  error,
  errorMessage,
  disabled = false,
  required = false,
}) => {
  const classes = useStyles();

  const styleCurrency = disabled
    ? {
        color: "rgba(0, 0, 0, 0.38)",
        pointerEvents: "none",
        borderBottom: "1px dotted rgba(0, 0, 0, 0.42)",
      }
    : null;

  const labelValue = required ? `${label} *` : label;

  return (
    <>
      {error || errorMessage ? (
        <>
          <Typography
            variant="body2"
            style={{
              fontSize: "12px",
              color: "red",
            }}
          >
            {labelValue}
          </Typography>
          <CurrencyInput
            className={classes.currency}
            decimalSeparator=","
            thousandSeparator="."
            prefix={prefix}
            suffix={suffix}
            value={value}
            error={true}
            precision={precision ?? 2}
            onChangeEvent={onChangeEvent}
            style={{
              borderColor: "red",
            }}
          />
          <CustomFormHelperText errorMessage={errorMessage} />
        </>
      ) : (
        <>
          <Typography
            variant="body2"
            style={{
              fontSize: "12px",
              color: disabled ? "rgba(0, 0, 0, 0.38)" : "rgba(0, 0, 0, 0.54)",
            }}
          >
            {labelValue}
          </Typography>
          <CurrencyInput
            className={classes.currency}
            decimalSeparator=","
            thousandSeparator="."
            prefix={prefix}
            suffix={suffix}
            value={value}
            error={true}
            precision={precision ?? 2}
            onChangeEvent={onChangeEvent}
            style={styleCurrency}
          />
        </>
      )}
    </>
  );
};

export default CustomCurrencyInput;
