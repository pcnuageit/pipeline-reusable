import { Box, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useSelector } from "react-redux";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
}));

const CustomBreadcrumbs = ({ path1, path2, path3, to1, to2 }) => {
  const classes = useStyles();
  const token = useAuth();
  const userData = useSelector((state) => state.userData);
  const history = useHistory();

  return (
    <Box className={classes.root}>
      <Breadcrumbs separator="›">
        <Link
          color="inherit"
          to={token && userData === "" ? "/dashboard/adm" : "/dashboard/home"}
        >
          <Typography
            color={APP_CONFIG.mainCollors.primary}
            style={{ fontSize: "1.2rem" }}
          >
            Home
          </Typography>
        </Link>
        <Link
          color="inherit"
          to={to1 !== "goBack" ? to1 : undefined}
          onClick={to1 === "goBack" ? () => history.goBack() : null}
        >
          <Typography
            color={APP_CONFIG.mainCollors.primary}
            style={{ fontSize: "1.2rem" }}
          >
            {" "}
            {path1}
          </Typography>
        </Link>
        <Link
          color="inherit"
          to={to2 === "goBack" ? () => history.goBack() : to2}
        >
          <Typography
            color={APP_CONFIG.mainCollors.primary}
            style={{ fontSize: "1.2rem" }}
          >
            {" "}
            {path2}
          </Typography>
        </Link>
        {path3 ? (
          <Link color="inherit">
            <Typography
              color={APP_CONFIG.mainCollors.primary}
              style={{ fontSize: "1.2rem" }}
            >
              {" "}
              {path3}
            </Typography>
          </Link>
        ) : null}
      </Breadcrumbs>
    </Box>
  );
};

export default CustomBreadcrumbs;
