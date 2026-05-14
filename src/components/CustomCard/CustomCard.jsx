import { Box, Grid, makeStyles, Typography } from "@material-ui/core";

import { APP_CONFIG } from "../../constants/config";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: APP_CONFIG.mainCollors.primary,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    borderRadius: "17px",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
    },
  },
  icon: {
    color: "white",
    fontSize: "60px",
  },
  text: {
    color: "white",
    fontSize: "13px",
    fontFamily: "Montserrat-ExtraBold",
    marginTop: "10px",
  },
}));

const CustomCard = ({ Icon = null, title, onClick = () => null }) => {
  const classes = useStyles();

  return (
    <Grid item sm={3} xs={12}>
      <Box className={classes.root} onClick={onClick}>
        {Icon ? <Icon className={classes.icon} /> : null}

        <Typography className={classes.text}>{title}</Typography>
      </Box>
    </Grid>
  );
};

export default CustomCard;
