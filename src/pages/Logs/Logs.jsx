import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  IconButton,
  LinearProgress,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import { getLogsAction } from "../../actions/actions";

import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";
import { Pagination } from "@material-ui/lab";
import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "0px",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "0px",
  },
  tableContainer: { marginTop: "1px" },
  pageTitle: {
    color: APP_CONFIG.mainCollors.primary,
    fontFamily: "Montserrat-SemiBold",
  },
}));

const options = {
  displayType: "text",
  thousandSeparator: ".",
  decimalSeparator: ",",
  prefix: "R$ ",
  decimalScale: 2,
  fixedDecimalScale: true,
};

const Logs = () => {
  const columns = [
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (data) => {
        const date = new Date(data);
        const option = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };
        const formatted = date.toLocaleDateString("pt-br", option);
        return (
          <Box display="flex" justifyContent="center">
            <FontAwesomeIcon icon={faCalendar} size="lg" />
            <Typography style={{ marginLeft: "6px" }}>{formatted}</Typography>
          </Box>
        );
      },
    },

    {
      headerText: "Email",
      key: "",
      FullObject: (row) => (
        <Typography>{row && row.user ? row.user.email : ""}</Typography>
      ),
    },
    {
      headerText: "Descrição",
      key: "descricao",
    },
    {
      headerText: "IP",
      key: "ip",
    },

    /* {
			headerText: '',
			key: 'menu',
		}, */
  ];

  const token = useAuth();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const listaLogs = useSelector((state) => state.logs);
  const [filters, setFilters] = useState({
    user_id: "",
    like: "",
    order: "",
    mostrar: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);

  useEffect(() => {
    dispatch(
      getLogsAction(
        token,
        filters.user_id,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
      ),
    );
  }, [page, debouncedLike, filters.order, filters.mostrar]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const Editar = ({ row }) => {
    const handleClick = (event) => {
      const path = generatePath("/dashboard/taxa/:id/editar", {
        id: row.id,
      });
      history.push(path);
    };

    return (
      <Box>
        <IconButton
          style={{
            height: "15px",
            width: "10px",
          }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <SettingsIcon
            style={{
              borderRadius: 33,
              fontSize: "35px",
              backgroundColor: "#ffdc00",
              color: "white",
            }}
          />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box style={{ marginBottom: "10px" }}>
          <CustomHeader pageTitle="Logs" />
        </Box>
        <Box style={{ alignSelf: "flex-end", marginBottom: "10px" }}>
          <IconButton
            style={{
              backgroundColor: APP_CONFIG.mainCollors.backgrounds,
              color: APP_CONFIG.mainCollors.primary,
            }}
            onClick={() => window.location.reload(false)}
          >
            <RefreshIcon></RefreshIcon>
          </IconButton>
        </Box>
        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ margin: 30 }}
          >
            <TextField
              label="Pesquisar por nome, documento, email..."
              size="small"
              variant="outlined"
              style={{
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                width: "400px",
              }}
              onChange={(e) => {
                setPage(1);
                setFilters({
                  ...filters,
                  like: e.target.value,
                });
              }}
            ></TextField>
          </Box>
        </Box>
      </Box>

      <Box className={classes.tableContainer}>
        {listaLogs.data && listaLogs.per_page ? (
          <CustomTable
            columns={columns ? columns : null}
            data={listaLogs.data}
            Editar={Editar}
          />
        ) : (
          <Box width="60vw">
            <LinearProgress color="secondary" />
          </Box>
        )}
        <Box
          display="flex"
          alignSelf="flex-end"
          marginTop="8px"
          justifyContent="space-between"
        >
          <Pagination
            variant="outlined"
            color="secondary"
            size="large"
            count={listaLogs.last_page}
            onChange={handleChangePage}
            page={page}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Logs;
