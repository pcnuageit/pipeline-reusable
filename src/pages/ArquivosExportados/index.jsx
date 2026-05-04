import {
  Box,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { postAuthMeAction } from "../../actions/actions";
import { APP_CONFIG } from "../../constants/config";
import "../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import {
  getArquivosExportados,
  getDownloadArquivoExportadoVoucher,
} from "../../services/services";
import px2vw from "../../utils/px2vw";

import { Delete, Download } from "@mui/icons-material";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable/CustomTable";
import TableHeaderButton from "../../components/TableHeaderButton";
import usePermission from "../../hooks/usePermission";
import { translateStatus } from "../../utils/translateStatus";

moment.locale("pt-br");

export default function ArquivosExportados() {
  const token = useAuth();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const [listaArquivos, setListaArquivos] = useState();
  const [filter, setFilter] = useState({
    created_at: "",
    status: " ", // processing, success e failed
    type: " ", // xlsx, pdf
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    headerContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: "25px",
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
  }))();

  const columns = [
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (value) => moment.utc(value).format("DD/MM/YYYY HH:mm"),
    },
    { headerText: "TIPO", key: "filters.export_type" },
    {
      headerText: "ORIGEM",
      key: "origem",
      // key: "class_name",
      // CustomValue: (v) => <Typography>{parseClassNameResponse(v)}</Typography>,
    },
    {
      headerText: "STATUS",
      key: "status",
      CustomValue: (v) => <Typography>{translateStatus(v)}</Typography>,
    },
    hasPermission(PERMISSIONS.arquivos_exportados.actions.download)
      ? { headerText: "DOWNLOAD", key: "menu" }
      : {},
  ];

  const resetFilters = () => {
    setPage(1);
    setFilter({
      created_at: "",
      status: " ",
      type: " ",
      mostrar: "15",
    });
  };

  const filters = `created_at=${filter.created_at}&status=${filter.status}&type=${filter.type}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getArquivosExportados(token, page, "", filters);
      console.log(data);
      setListaArquivos(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (row) => {
    if (!row?.url) {
      toast.error("Este arquivo não está mais disponível.");
      return;
    }

    try {
      toast.warning("Carregando arquivo...");
      const { data } = await getDownloadArquivoExportadoVoucher(token, row?.id);
      const newWindow = window.open(data, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

  return (
    <Box className={useStyles.root}>
      <Box className={useStyles.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={useStyles.pageTitle}>
            Arquivos exportados
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
          <Box style={{ margin: 30 }}>
            <Grid
              container
              spacing={3}
              style={{ alignItems: "center", marginBottom: "8px" }}
            >
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Pesquisar por data"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  InputLabelProps={{
                    color: APP_CONFIG.mainCollors.secondary,
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  value={filter.created_at}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      created_at: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <InputLabel id="tipo_label" shrink="true">
                  Tipo
                </InputLabel>
                <Select
                  labelId="tipo_label"
                  variant="outlined"
                  fullWidth
                  required
                  value={filter.type}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }));
                  }}
                >
                  <MenuItem value={" "}>Todos</MenuItem>
                  <MenuItem value={"statement"}>statement</MenuItem>
                  <MenuItem value={"transfer"}>transfer</MenuItem>
                  <MenuItem value={"transaction"}>transaction</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={3}>
                <InputLabel id="status_label" shrink="true">
                  Status
                </InputLabel>
                <Select
                  labelId="status_label"
                  variant="outlined"
                  fullWidth
                  required
                  value={filter.status}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }));
                  }}
                >
                  <MenuItem value={" "}>Todos</MenuItem>
                  <MenuItem value={"processing"}>
                    {translateStatus("processing")}
                  </MenuItem>
                  <MenuItem value={"success"}>
                    {translateStatus("success")}
                  </MenuItem>
                  <MenuItem value={"failed"}>
                    {translateStatus("failed")}
                  </MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={3}>
                <InputLabel id="mostrar_label" shrink="true">
                  Itens por página
                </InputLabel>
                <Select
                  labelId="mostrar_label"
                  value={filter.mostrar}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({ ...filter, mostrar: e.target.value });
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
          </Box>
        </Box>

        {hasPermission(PERMISSIONS.arquivos_exportados.list.view) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaArquivos?.data && listaArquivos?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={listaArquivos?.data}
                    Editar={({ row }) => (
                      <Download onClick={() => handleDownload(row)} />
                    )}
                  />
                </TableContainer>
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
                count={listaArquivos?.last_page}
                onChange={(e, value) => setPage(value)}
                page={page}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function parseClassNameResponse(str) {
  return str
    ?.split("\\")
    ?.pop()
    ?.replace(/([A-Z])/g, " $1")
    ?.trim();
}
