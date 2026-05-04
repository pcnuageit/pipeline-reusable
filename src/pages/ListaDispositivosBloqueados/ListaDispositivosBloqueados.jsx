import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getListaDeviceBloqueadoAction } from "../../actions/actions";

import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import usePermission from "../../hooks/usePermission";
import px2vw from "../../utils/px2vw";

const columns = [
  {
    headerText: "Nome",
    key: "",
    FullObject: (data) => (
      <Typography>{data.conta.nome && data.conta.nome}</Typography>
    ),
  },
  {
    headerText: "Documento",
    key: "",
    FullObject: (value) => {
      return (
        <Typography>
          {value.conta.documento && value.conta.documento}
        </Typography>
      );
    },
  },
  {
    headerText: "Contato",
    key: "",
    FullObject: (value) => {
      return (
        <Typography>{value.conta.celular && value.conta.celular}</Typography>
      );
    },
  },
  {
    headerText: "Email",
    key: "",
    FullObject: (value) => {
      return <Typography>{value.conta.email && value.conta.email}</Typography>;
    },
  },
  {
    headerText: "Descrição",
    key: "descricao",
    CustomValue: (value) => {
      return <Typography>{value}</Typography>;
    },
  },
];

const ListaDispositivosBloqueados = () => {
  const token = useAuth();
  const { hasPermission, PERMISSIONS } = usePermission();
  const dispatch = useDispatch();
  const listaContas = useSelector((state) => state.listaDeviceBloqueado);
  const history = useHistory();
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    like: "",
    order: "",
    mostrar: "",
  });
  const debouncedLike = useDebounce(filters.like, 800);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const useStyles = makeStyles(() => ({
    root: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      marginRight: "30px",
    },
    headerContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: "0px",
      width: px2vw("100%"),
      "@media (max-width: 1440px)": {
        width: "950px",
      },
      "@media (max-width: 1280px)": {
        width: "850px",
      },
    },
    tableContainer: { marginTop: "1px" },
    pageTitle: {
      color: APP_CONFIG.mainCollors.primary,
      fontFamily: "Montserrat-SemiBold",
    },
  }));
  const classes = useStyles();
  const handleChangePage = (e, value) => {
    setPage(value);
  };

  useEffect(() => {
    dispatch(
      getListaDeviceBloqueadoAction(
        token,
        page,
        debouncedLike,
        filters.order,
        filters.mostrar
      )
    );
  }, [page, debouncedLike, filters.order, filters.mostrar]);

  const handleClickRow = (row) => {};

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
          <Typography className={classes.pageTitle}>
            Dispositivos Bloqueados
          </Typography>

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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            style={{ margin: 30 }}
          >
            {hasPermission(PERMISSIONS.dispositivos_bloqueados.list.search) && (
              <TextField
                placeholder="Pesquisar por nome, documento, email..."
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
            )}
          </Box>
        </Box>

        {hasPermission(PERMISSIONS.dispositivos_bloqueados.list.view) && (
          <Box className={classes.tableContainer}>
            {listaContas.data && listaContas.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <CustomTable
                  columns={columns ? columns : null}
                  data={listaContas.data}
                  handleClickRow={handleClickRow}
                />
              </Box>
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
                count={listaContas.last_page}
                onChange={handleChangePage}
                page={page}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ListaDispositivosBloqueados;
