import {
  Box,
  Checkbox,
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
import { Check, Delete } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postAuthMeAction } from "../../../actions/actions";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import { ModalManager } from "../../../components/ModalManager";
import SelectBeneficio from "../../../components/SelectBeneficio";
import SelectCidade from "../../../components/SelectCidade";
import TableHeaderButton from "../../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import usePermission from "../../../hooks/usePermission";
import useQuery from "../../../hooks/useQuery";
import { getSegundaViaList } from "../../../services/beneficiarios";
import { documentMask } from "../../../utils/documentMask";
import px2vw from "../../../utils/px2vw";
import { translateStatus } from "../../../utils/translateStatus";
import { ModalManagerListaCartaoSegundaVia } from "./ModalManager";

moment.locale("pt-br");

const styles = makeStyles((theme) => ({
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
  modal: {
    outline: " none",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    position: "absolute",
    top: "10%",
    left: "35%",
    width: "30%",
    height: "80%",
    backgroundColor: "white",
    border: "0px solid #000",
    boxShadow: 24,
  },
  closeModalButton: {
    alignSelf: "end",
    padding: "5px",
    "&:hover": {
      backgroundColor: APP_CONFIG.mainCollors.primaryVariant,
      cursor: "pointer",
    },
  },
}));

export default function ListaCartaoSegundaVia() {
  const theme = useTheme();
  const token = useAuth();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const queryParams = useQuery();
  const arquivo_id = queryParams.get("arquivo_id") ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    status: " ",
    cartao_privado_id: "",
    documento: "",
    tipo_beneficio_id: "",
    cidade: "",
    cidade_cartao: "",
    identificador_unico: "",
    arquivo_id,
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [showModalNovoCadastro, setShowModalNovoCadastro] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const [showModalManager, setShowModalManager] = useState(false); //false, "solicitar", "negar", "enviado"
  const [registros, setRegistros] = useState([]);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const useStyles = styles();

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      status: " ",
      cartao_privado_id: "",
      documento: "",
      tipo_beneficio_id: "",
      cidade: "",
      cidade_cartao: "",
      identificador_unico: "",
      arquivo_id,
    });
  };

  const filters = `status=${filter.status}&cartao_privado_id=${filter.cartao_privado_id}&documento=${filter.documento}&tipo_beneficio_id=${filter.tipo_beneficio_id}&cidade=${filter.cidade}&cidade_cartao=${filter.cidade_cartao}&identificador_unico=${filter.identificador_unico}&arquivo_id=${filter.arquivo_id}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getSegundaViaList(token, id, page, filters);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const canSelect = () => {
    if (filter.status === "created" || filter.status === "success") return true;
  };

  const handleSelectAll = () => {
    const selected = listaContas?.data?.map((obj) => obj?.id);
    setRegistros(selected);
  };

  useEffect(() => {
    getData(token, page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    dispatch(postAuthMeAction(token));
  }, [token, dispatch]);

  const columns = [
    canSelect()
      ? {
          headerText: "",
          key: "",
          FullObject: (obj) => {
            const checked = registros.some((item) => item === obj?.id);

            return (
              <>
                <Box>
                  <Checkbox
                    color="primary"
                    checked={checked}
                    onChange={() => {
                      if (checked) {
                        setRegistros(
                          registros.filter((item) => item !== obj?.id),
                        );
                      } else {
                        console.log(obj.id);
                        setRegistros((prev) => [...prev, obj?.id]);
                      }
                    }}
                  />
                </Box>
              </>
            );
          },
        }
      : {},
    {
      headerText: "DATA",
      key: "created_at",
      CustomValue: (value) => (
        <Typography>{moment.utc(value).format("DD/MM/YYYY")}</Typography>
      ),
    },
    {
      headerText: "ID",
      key: "cartao_privado.external_id",
      CustomValue: (valor) => <Typography>{valor || "Processando"}</Typography>,
    },
    {
      headerText: "Identificador",
      key: "identificador_unico",
      CustomValue: (valor) => <Typography>{valor || "Processando"}</Typography>,
    },
    {
      headerText: "FINAL",
      key: "cartao_privado.external_msk",
      CustomValue: (valor) => {
        return (
          <>
            <Typography>
              {valor ? valor?.replace(/\*/g, "") : "Processando"}
            </Typography>
          </>
        );
      },
    },
    // {
    //   headerText: "SALDO",
    //   key: "concorrencia_saldo.valor",
    //   CustomValue: (valor) => {
    //     return (
    //       <>
    //         <Typography>
    //           R${" "}
    //           {parseFloat(valor).toLocaleString("pt-br", {
    //             minimumFractionDigits: 2,
    //             maximumFractionDigits: 2,
    //           })}
    //         </Typography>
    //       </>
    //     );
    //   },
    // },
    { headerText: "motivo", key: "motivo" },
    {
      headerText: "STATUS",
      key: "status",
      CustomValue: (v) => <Typography>{translateStatus(v)}</Typography>,
    },
    { headerText: "NOME", key: "cartao_privado.user.nome" },
    {
      headerText: "CPF",
      key: "cartao_privado.user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    {
      headerText: "BENEFÍCIO",
      key: "cartao_privado.tipo_beneficio.nome_beneficio",
    },
    {
      headerText: "Cidade do Beneficiário",
      key: "cartao_privado.user.concorrencia_endereco.cidade",
    },
    {
      headerText: "Cidade do Cartão",
      key: "cartao_privado.municipio",
    },
    { headerText: "", key: "menu" },
  ];

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
            Contas Cartão - Segunda Via
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
            {hasPermission(PERMISSIONS.secretarias.cartoes.view) && (
              <Grid
                container
                spacing={3}
                style={{ alignItems: "center", marginBottom: "8px" }}
              >
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por ID"
                    size="small"
                    variant="outlined"
                    value={filter.cartao_privado_id}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        cartao_privado_id: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextFieldCpfCnpj
                    placeholder="Pesquisar por documento"
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
                  <InputLabel id="status-label" shrink="true">
                    Status
                  </InputLabel>
                  <Select
                    labelId="status-label"
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
                      setRegistros([]);
                    }}
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"pending"}>
                      {translateStatus("pending")}
                    </MenuItem>
                    <MenuItem value={"created"}>
                      {translateStatus("created")}
                    </MenuItem>
                    <MenuItem value={"success"}>
                      {translateStatus("success")}
                    </MenuItem>
                    <MenuItem value={"failed"}>
                      {translateStatus("failed")}
                    </MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectBeneficio
                    state={filter.tipo_beneficio_id}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        tipo_beneficio_id: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectCidade
                    label="Cidade do Beneficiário"
                    state={filter.cidade}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        cidade: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectCidade
                    label="Cidade do Cartão"
                    state={filter.cidade_cartao}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        cidade_cartao: e.target.value,
                        identificador_unico: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por Identificador"
                    variant="outlined"
                    value={filter.identificador_unico}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        identificador_unico: e.target.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              {hasPermission(PERMISSIONS.secretarias.cartoes.view) && (
                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilters}
                />
              )}

              {canSelect() &&
                hasPermission(PERMISSIONS.secretarias.cartoes.actions) && (
                  <>
                    {filter.status === "created" && (
                      <TableHeaderButton
                        text="Solicitar segunda via"
                        onClick={() => {
                          if (registros.length === 0) {
                            toast.warning(
                              "Selecione algum cartão para continuar",
                            );
                            return;
                          }
                          setShowModalManager("solicitar");
                        }}
                      />
                    )}

                    {filter.status === "created" && (
                      <TableHeaderButton
                        text="Negar segunda via"
                        onClick={() => {
                          if (registros.length === 0) {
                            toast.warning(
                              "Selecione algum cartão para continuar",
                            );
                            return;
                          }
                          setShowModalManager("negar");
                        }}
                        color="red"
                      />
                    )}

                    {filter.status === "success" && (
                      <TableHeaderButton
                        text="Marcar segunda via enviada"
                        onClick={() => {
                          if (registros.length === 0) {
                            toast.warning(
                              "Selecione algum cartão para continuar",
                            );
                            return;
                          }
                          setShowModalManager("enviado");
                        }}
                      />
                    )}

                    <TableHeaderButton
                      text="Selecionar todos"
                      onClick={handleSelectAll}
                      Icon={Check}
                    />
                  </>
                )}
            </Grid>
          </Box>

          <Typography
            className={useStyles.pageTitle}
            style={{
              marginLeft: "30px",
              paddingBottom: "16px",
              marginBottom: "1px",
            }}
          >
            CONTAS RECENTES
          </Typography>
        </Box>

        {hasPermission(PERMISSIONS.secretarias.cartoes.view) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaContas?.data && listaContas?.per_page ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    columns={columns}
                    data={listaContas?.data}
                    Editar={({ row }) => (
                      <MenuOptionsTable viewAttachedFiles={row?.arquivos} />
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
        tipo="cartao"
        show={showModalNovoCadastro}
        setShow={setShowModalNovoCadastro}
        getData={getData}
      />

      <ModalManagerListaCartaoSegundaVia
        show={showModalManager}
        setShow={setShowModalManager}
        getData={getData}
        registros={registros}
        setRegistros={setRegistros}
      />
    </Box>
  );
}
