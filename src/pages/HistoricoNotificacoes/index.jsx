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
import { Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTable from "../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../components/ExportTableButtons";
import TableHeaderButton from "../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../constants/config";
import "../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getNotificacaoConta } from "../../services/services";
import { documentMask } from "../../utils/documentMask";
import px2vw from "../../utils/px2vw";

moment.locale("pt-br");

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (v) => (
      <Typography>{moment(v).format("DD/MM/YYYY")}</Typography>
    ),
  },
  { headerText: "Mensagem", key: "mensagem" },
  {
    headerText: "Nome do beneficiário",
    key: "user",
    CustomValue: (user) => (
      <Typography>{user?.is_beneficiario ? user?.nome : ""}</Typography>
    ),
  },
  {
    headerText: "CPF do beneficiário",
    key: "user",
    CustomValue: (user) => (
      <Typography>{user?.is_beneficiario ? user?.documento : ""}</Typography>
    ),
  },
  {
    headerText: "Nome do estabeleciemnto",
    key: "conta",
    CustomValue: (conta) => (
      <Typography>
        {conta?.is_estabelecimento ? conta?.razao_social ?? conta?.nome : ""}
      </Typography>
    ),
  },
  {
    headerText: "Documento do estabeleciemnto",
    key: "conta",
    CustomValue: (conta) => (
      <Typography>
        {conta?.is_estabelecimento
          ? documentMask(conta?.cnpj ?? conta?.documento)
          : ""}
      </Typography>
    ),
  },
];

export default function HistoricoNotificacoes() {
  const token = useAuth();
  const arquivo_id = useParams()?.subsection ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    nome_beneficiario: "",
    documento_beneficiario: "",
    nome_estabelecimento: "",
    documento_estabelecimento: "",
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

  const resetFilters = () => {
    setPage(1);
    setFilter({
      nome_beneficiario: "",
      documento_beneficiario: "",
      nome_estabelecimento: "",
      documento_estabelecimento: "",
      mostrar: "15",
    });
  };

  const filters = `arquivo_id=${arquivo_id}&nome_beneficiario=${debouncedFilter.nome_beneficiario}&documento_beneficiario=${debouncedFilter.documento_beneficiario}&nome_estabelecimento=${debouncedFilter.nome_estabelecimento}&documento_estabelecimento=${debouncedFilter.documento_estabelecimento}&mostrar=${debouncedFilter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getNotificacaoConta(
        token,
        arquivo_id,
        page,
        filters
      );
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
            Histórico de notificações {arquivo_id && "- Detalhamento"}
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
                  placeholder="Nome do benificiário"
                  size="small"
                  variant="outlined"
                  value={filter.nome_beneficiario}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      nome_beneficiario: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextFieldCpfCnpj
                  placeholder="Documento do beneficiário"
                  value={filter.documento_beneficiario}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      documento_beneficiario: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  placeholder="Nome do estabelecimento"
                  size="small"
                  variant="outlined"
                  value={filter.nome_estabelecimento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter((prev) => ({
                      ...prev,
                      nome_estabelecimento: e.target.value,
                    }));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextFieldCpfCnpj
                  placeholder="Documento do estabelecimento"
                  value={filter.documento_estabelecimento}
                  onChange={(e) => {
                    setPage(1);
                    setFilter({
                      ...filter,
                      documento_estabelecimento: e.target.value,
                    });
                  }}
                />
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
                apiPath={"conta/notificacao/export"}
                page={page}
                filters={filters}
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
