import { InputAdornment, TextField, Typography } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  textField: {
    borderBottom: "3px",
    borderBottomColor: "white",
    borderRadius: "0px",

    /* boxShadow: '0px 0px 5px 0.5px grey', */
    height: "45px !important",
    borderColor: "white",
    borderWidth: "1px",
    "& .MuiInput-underline:before": {
      borderBottom: "0px solid white",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "0px solid yellow",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottom: "0px solid green",
    },
  },

  cssLabel: {},

  cssOutlinedInput: {
    borderColor: "white",
    borderRadius: "0px",
    "&$cssFocused $notchedOutline": {
      borderWidth: "1px",
    },
    "& :-webkit-autofill": {
      "-webkit-padding-after": "13px",
      "-webkit-padding-before": "13px",
      "-webkit-padding-end": "13px",
      "-webkit-padding-start": "13px",
      "-webkit-background-clip": "text",
      "-webkit-text-color": "white",
    },
  },

  input: {
    "&::placeholder": {
      textOverflow: "ellipsis !important",
      color: "white",
      fontWeight: "600",
      fontSize: "14px",
    },

    textAlign: "left",
    fontSize: "20px",
    borderRadius: "0px",
    height: "10px",
    color: "white",
  },

  cssFocused: {
    borderWidth: "1px",
    borderColor: "white",
  },

  notchedOutline: {
    borderWidth: "1px",
    borderColor: "white",
  },
}));
const CustomTextField = (rest) => {
  const classes = useStyles();
  return (
    <TextField
      variant="outlined"
      {...rest}
      className={classes.textField}
      InputProps={{
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
          notchedOutline: classes.notchedOutline,
          input: classes.input,
        },
        startAdornment: (
          <InputAdornment position="start">
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "20px",
                color: "white",
              }}
            >
              R$
            </Typography>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomTextField;
