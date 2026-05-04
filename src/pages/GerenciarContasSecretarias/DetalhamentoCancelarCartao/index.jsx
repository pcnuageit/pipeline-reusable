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
import { Delete, FileCopy } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postAuthMeAction } from "../../../actions/actions";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import TableHeaderButton from "../../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import useQuery from "../../../modules/AntecipacaoSalarial/hooks/useQuery";
import {
  getAuditSGC,
  postAuditSGCReprocessar,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";
import { translateStatus } from "../../../utils/translateStatus";

moment.locale("pt-br");

// Cidade;
// Programa;
// Status;
const columns = [
  { headerText: "nº do Cartão", key: "auditable.external_msk" },
  { headerText: "Nome do beneficiário", key: "auditable.user.nome" },
  { headerText: "CPF do beneficiário", key: "auditable.user.documento" },
  {
    headerText: "Status",
    key: "status",
    CustomValue: (v) => <Typography>{translateStatus(v)}</Typography>,
  },
  {
    headerText: "Saldo",
    key: "auditable.concorrencia_saldo.valor",
    CustomValue: (v) => {
      if (!v) return <Typography>-</Typography>;
      return (
        <>
          <Typography
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: "15px",
              color: APP_CONFIG.mainCollors.primary,
            }}
          >
            R${" "}
            {parseFloat(v).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </>
      );
    },
  },
];

export default function DetalhamentoCancelarCartao() {
  const token = useAuth();
  const dispatch = useDispatch();
  const conta_id = useParams()?.id ?? "";
  const arquivoId = useParams()?.subsectionId ?? "";
  const pageIndex = useQuery()?.get("page") ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    status: " ",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(pageIndex);
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

  const resetFilters = () => {
    setPage(1);
    setFilter({
      nome: "",
      documento: "",
      status: " ",
      mostrar: "15",
    });
  };

  const filters = `conta_id=${conta_id}&arquivo_id=${arquivoId}&nome=${debouncedFilter.nome}&documento=${debouncedFilter.documento}&status=${debouncedFilter.status}&mostrar=${debouncedFilter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getAuditSGC(token, arquivoId, page, filters);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

  const handleReprocessar = async () => {
    setLoading(true);
    try {
      await postAuditSGCReprocessar(token, arquivoId);
      toast.success("O arquivo foi reprocesasado.");
      await getData(token);
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel reprocessar o arquivo. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

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
            Detalhamento Ações Cartão
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por nome"
                  size="small"
                  variant="outlined"
                  value={filter.nome}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({ ...prev, nome: e.target.value }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextFieldCpfCnpj
                  placeholder="Pesquisar por documento"
                  value={filter.documento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      documento: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
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
                  <MenuItem value={"pending"}>
                    {translateStatus("pending")}
                  </MenuItem>
                  <MenuItem value={"failed"}>
                    {translateStatus("failed")}
                  </MenuItem>
                  <MenuItem value={"succeeded"}>
                    {translateStatus("succeeded")}
                  </MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={2}>
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
                Icon={Delete}
                text="Limpar"
                color="red"
                onClick={resetFilters}
              />

              <ExportTableButtons
                token={token}
                path={"audit-sgc"}
                page={page}
                filters={filters}
              />

              <TableHeaderButton
                Icon={FileCopy}
                text="Reprocessar"
                onClick={handleReprocessar}
              />
            </Grid>
          </Box>
        </Box>

        <Box className={useStyles.tableContainer}>
          {!loading && listaContas?.data && listaContas?.per_page ? (
            <Box minWidth={!matches ? "800px" : null}>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable
                  columns={columns}
                  data={listaContas?.data}
                  // Editar={({ row }) => (
                  //   <MenuOptionsTable
                  //     row={row}
                  //     getData={getData}
                  //     deleteCallback={deleteBeneficio}
                  //     editType={"beneficio"}
                  //   />
                  // )}
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
              count={listaContas?.last_page}
              onChange={(e, value) => setPage(value)}
              page={page}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
