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
import { Add, Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { postAuthMeAction } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  deleteBeneficio,
  getBeneficios,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";

import CustomTable from "../../../components/CustomTable/CustomTable";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import { ModalManager } from "../../../components/ModalManager";
import TableHeaderButton from "../../../components/TableHeaderButton";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";

moment.locale("pt-br");

const columns = [
  { headerText: "NOME", key: "nome_beneficio" },
  {
    headerText: "Tipo",
    key: "tipo",
    CustomValue: (text) => (
      <Typography align="center">
        {text === "cartao" ? "Cartão" : "Voucher"}
      </Typography>
    ),
  },
  {
    headerText: "Documento",
    key: "documento",
    CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
  },
  {
    headerText: "Prefeitura",
    key: "",
    FullObject: (obj) => `${obj?.nome_prefeitura} - ${obj.sigla}`,
  },
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (text) => (
      <Typography align="center">
        {moment(text).format("DD/MM/YYYY")}
      </Typography>
    ),
  },
  { headerText: "", key: "menu" },
];

export default function ListaBeneficios() {
  const token = useAuth();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    nome_beneficio: "",
    tipo: " ",
    nome_prefeitura: "",
    sigla: "",
    documento: "",
    external_id: "",
    created_at: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [showModalNovoCadastro, setShowModalNovoCadastro] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
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
      nome_beneficio: "",
      tipo: " ",
      nome_prefeitura: "",
      sigla: "",
      documento: "",
      external_id: "",
      created_at: "",
      mostrar: "15",
    });
  };

  const filters = `nome_beneficio=${filter.nome_beneficio}&tipo=${filter.tipo}&nome_prefeitura=${filter.nome_prefeitura}&sigla=${filter.sigla}&documento=${filter.documento}&external_id=${filter.external_id}&created_at=${filter.created_at}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getBeneficios(token, id, page, "", filters);
      console.log(data);
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
          <Typography className={useStyles.pageTitle}>Benefícios</Typography>

          {hasPermission(PERMISSIONS.beneficios.list.update_extract) && (
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
          )}
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
            {hasPermission(PERMISSIONS.beneficios.list.search) && (
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
                    style={{
                      marginRight: "10px",
                    }}
                    value={filter.nome_beneficio}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        nome_beneficio: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por ID"
                    size="small"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    value={filter.external_id}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        external_id: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por prefeitura"
                    size="small"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    value={filter.prefeitura}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        prefeitura: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por sigla"
                    size="small"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    value={filter.sigla}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({ ...prev, sigla: e.target.value }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por documento"
                    size="small"
                    variant="outlined"
                    style={{
                      marginRight: "10px",
                    }}
                    value={filter.documento}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        documento: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <InputLabel id="tipo_label" shrink="true">
                    Tipo
                  </InputLabel>
                  <Select
                    labelId="tipo_label"
                    variant="outlined"
                    fullWidth
                    required
                    value={filter.tipo}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        tipo: e.target.value,
                      }));
                    }}
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"beneficiario"}>Voucher</MenuItem>
                    <MenuItem value={"cartao"}>Cartão</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={4}>
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

                <Grid item xs={12} sm={4}>
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
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(PERMISSIONS.beneficios.list.search) && (
                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilters}
                />
              )}

              {hasPermission(PERMISSIONS.beneficios.actions.create) && (
                <TableHeaderButton
                  text="Novo cadastro"
                  onClick={() => setShowModalNovoCadastro(true)}
                  Icon={Add}
                />
              )}
            </Grid>
          </Box>
        </Box>

        {hasPermission(PERMISSIONS.beneficios.list.view) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaContas?.data && listaContas?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={listaContas?.data}
                    Editar={({ row }) => (
                      <MenuOptionsTable
                        row={row}
                        getData={getData}
                        deleteCallback={
                          hasPermission(PERMISSIONS.beneficios.actions.delete)
                            ? deleteBeneficio
                            : null
                        }
                        editType={
                          hasPermission(PERMISSIONS.beneficios.actions.edit)
                            ? "beneficio"
                            : null
                        }
                      />
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
                count={listaContas?.last_page}
                onChange={(e, value) => setPage(value)}
                page={page}
              />
            </Box>
          </Box>
        )}
      </Box>

      <ModalManager.NovoCadastro
        tipo="beneficio"
        show={showModalNovoCadastro}
        setShow={setShowModalNovoCadastro}
        getData={getData}
      />
    </Box>
  );
}
