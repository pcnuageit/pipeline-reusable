import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import SettingsIcon from "@material-ui/icons/Settings";
import { Pagination } from "@material-ui/lab";
import { CalendarMonth } from "@mui/icons-material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";

import { getLogsAction } from "../../actions/actions";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";

import { Delete } from "@material-ui/icons";
import CustomTable from "../../components/CustomTable/CustomTable";
import TableHeaderButton from "../../components/TableHeaderButton";
import { APP_CONFIG } from "../../constants/config";
import usePermission from "../../hooks/usePermission";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    paddingRight: 50,
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

const Logs = () => {
  const columns = [
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (value) => {
        return (
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <CalendarMonth />

            <Typography style={{ marginLeft: "6px" }}>
              {moment.utc(value).format("DD/MM/YYYY HH:mm")}
            </Typography>
          </Box>
        );
      },
    },
    {
      headerText: "Email",
      key: "",
      FullObject: (row) => <Typography>{row?.user?.email}</Typography>,
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
  const { hasPermission, PERMISSIONS } = usePermission();
  const [loading, setLoading] = useState(false);
  const listaLogs = useSelector((state) => state.logs);
  const [filters, setFilters] = useState({
    created_at: "",
    user_id: "",
    like: "",
    order: "",
    mostrar: "15",
  });
  const debouncedLike = useDebounce(filters.like, 800);

  const resetFilters = () => {
    setPage(1);
    setFilters({
      created_at: "",
      user_id: "",
      like: "",
      order: "",
      mostrar: "15",
    });
  };

  useEffect(() => {
    dispatch(
      getLogsAction(
        token,
        filters.user_id,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar,
        filters.created_at
      )
    );
  }, [page, debouncedLike, filters.order, filters.mostrar, filters.created_at]);

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
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>Logs</Typography>
          <Box style={{ alignSelf: "flex-end" }}>
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
        </Box>

        <Box
          style={{
            width: "100%",
            backgroundColor: APP_CONFIG.mainCollors.backgrounds,
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
          }}
        >
          <Box style={{ margin: 30 }}>
            {hasPermission(PERMISSIONS.logs.list.search) && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    placeholder="Pesquisar por nome, documento, email..."
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                      setPage(1);
                      setFilters({
                        ...filters,
                        like: e.target.value,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Pesquisar por data"
                    size="small"
                    variant="outlined"
                    InputLabelProps={{
                      color: APP_CONFIG.mainCollors.secondary,
                      shrink: true,
                      pattern: "d {4}- d {2}- d {2} ",
                    }}
                    type="date"
                    value={filters.created_at}
                    onChange={(e) => {
                      setPage(1);
                      setFilters((prev) => ({
                        ...prev,
                        created_at: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <InputLabel id="mostrar_label" shrink="true">
                    Itens por página
                  </InputLabel>
                  <Select
                    labelId="mostrar_label"
                    value={filters.mostrar}
                    onChange={(e) => {
                      setPage(1);
                      setFilters({ ...filters, mostrar: e.target.value });
                    }}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value={"15"}>15</MenuItem>
                    <MenuItem value={"30"}>30</MenuItem>
                    <MenuItem value={"45"}>45</MenuItem>
                    <MenuItem value={"50"}>50</MenuItem>
                  </Select>
                </Grid>

                <TableHeaderButton
                  text="Limpar"
                  onClick={resetFilters}
                  Icon={Delete}
                  color="red"
                />
              </Grid>
            )}
          </Box>
        </Box>
      </Box>

      {hasPermission(PERMISSIONS.logs.list.view) && (
        <Box className={classes.tableContainer}>
          {listaLogs.data && listaLogs.per_page ? (
            <CustomTable
              columns={columns ? columns : null}
              data={listaLogs.data}
              Editar={Editar}
            />
          ) : (
            <Box>
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
      )}
    </Box>
  );
};

export default Logs;
