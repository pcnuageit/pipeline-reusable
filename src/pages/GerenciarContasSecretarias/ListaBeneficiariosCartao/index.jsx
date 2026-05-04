import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  Select,
  TableContainer,
  TextField,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Check, Close, Delete, ListAlt } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";

import { postAuthMeAction } from "../../../actions/actions";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  deleteCartao,
  getCartoes,
  postCartoesTrocarStatus,
  postSegundaViaCriar,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";

import { toast } from "react-toastify";
import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import { ModalManager } from "../../../components/ModalManager";
import SelectBeneficio from "../../../components/SelectBeneficio";
import SelectCidade from "../../../components/SelectCidade";
import SelectSegundaViaMotivo from "../../../components/SelectSegundaViaMotivo";
import TableHeaderButton from "../../../components/TableHeaderButton";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";

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

export default function ListaBeneficiariosCartao() {
  const theme = useTheme();
  const token = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    external_id: "",
    external_msk: "",
    status: " ",
    nome: "",
    documento: "",
    tipo_beneficio_id: "",
    cidade: "",
    cidade_cartao: "",
    curso: "",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [showModalNovoCadastro, setShowModalNovoCadastro] = useState(false);
  const { hasPermission, PERMISSIONS } = usePermission();
  const [showAlterarSelecionadosModal, setShowAlterarSelecionadosModal] =
    useState(false); //false, status, segunda_via
  const [registros, setRegistros] = useState([]);

  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const useStyles = styles();

  const resetFilters = () => {
    setPage(1);
    setRegistros([]);
    setFilter({
      external_id: "",
      external_msk: "",
      status: " ",
      nome: "",
      documento: "",
      tipo_beneficio_id: "",
      cidade: "",
      cidade_cartao: "",
      curso: "",
    });
  };

  const filters = `conta_id=${id}&external_id=${filter.external_id}&external_msk=${filter.external_msk}&status=${filter.status}&nome=${filter.nome}&documento=${filter.documento}&tipo_beneficio_id=${filter.tipo_beneficio_id}&cidade=${filter.cidade}&cidade_cartao=${filter.cidade_cartao}&curso=${filter.curso}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getCartoes(token, id, page, "", filters);
      setListaContas(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
    {
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
                    setRegistros(registros.filter((item) => item !== obj?.id));
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
    },
    {
      headerText: "ID",
      key: "external_id",
      CustomValue: (valor) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {valor || "Processando"}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "FINAL",
      key: "external_msk",
      CustomValue: (valor) => {
        return (
          <>
            <Typography
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "15px",
                color: APP_CONFIG.mainCollors.primary,
              }}
            >
              {valor ? valor?.replace(/\*/g, "") : "Processando"}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "SALDO",
      key: "concorrencia_saldo.valor",
      CustomValue: (valor) => {
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
              {parseFloat(valor).toLocaleString("pt-br", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </>
        );
      },
    },
    { headerText: "STATUS", key: "status" },
    { headerText: "NOME", key: "user.nome" },
    {
      headerText: "CPF",
      key: "user.documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "BENEFÍCIO", key: "tipo_beneficio.nome_beneficio" },
    {
      headerText: "Cidade do Beneficiário",
      key: "user.concorrencia_endereco.cidade",
    },
    {
      headerText: "Cidade do Cartão",
      key: "municipio",
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
          <Typography className={useStyles.pageTitle}>Contas Cartão</Typography>

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
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por ID"
                    size="small"
                    variant="outlined"
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

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por final"
                    size="small"
                    variant="outlined"
                    value={filter.external_msk}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        external_msk: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
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
                    }}
                  >
                    <MenuItem value={" "}>Todos</MenuItem>
                    <MenuItem value={"aguardando"}>Aguardando</MenuItem>
                    <MenuItem value={"ativo"}>Ativo</MenuItem>
                    <MenuItem value={"bloqueado"}>Bloqueado</MenuItem>
                    <MenuItem value={"bloqueado_tentativas"}>
                      Bloqueado tentativas
                    </MenuItem>
                    <MenuItem value={"bloqueio_administrativo"}>
                      Bloqueio administrativo
                    </MenuItem>
                    <MenuItem value={"pendente"}>Pendente</MenuItem>
                    <MenuItem value={"error_interno"}>Erro interno</MenuItem>
                    <MenuItem value={"error"}>Erro</MenuItem>
                    <MenuItem value={"cancelado"}>Cancelado</MenuItem>
                    <MenuItem value={"excluido"}>Excluído</MenuItem>
                  </Select>
                </Grid>

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
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por documento"
                    size="small"
                    variant="outlined"
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
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por curso"
                    variant="outlined"
                    value={filter.curso}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        curso: e.target.value,
                      }));
                    }}
                  />
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

              {hasPermission(
                PERMISSIONS.secretarias.cartoes.view_batch_files,
              ) && (
                  <>
                    <TableHeaderButton
                      text="Cancelar em lote"
                      onClick={() => {
                        const path = generatePath(
                          "lista-arquivos-de-lote?type=cancelamento_cartao",
                        );
                        history.push(path);
                      }}
                      color="red"
                    />

                    <TableHeaderButton
                      text="Bloquear em lote"
                      onClick={() => {
                        const path = generatePath(
                          "lista-arquivos-de-lote?type=bloquear_cartao",
                        );
                        history.push(path);
                      }}
                      color="red"
                    />

                    <TableHeaderButton
                      text="Adicionar em lote"
                      onClick={() => {
                        const path = generatePath(
                          "lista-arquivos-de-lote?type=cartao",
                        );
                        history.push(path);
                      }}
                    />

                    <TableHeaderButton
                      text="Atualizar em lote"
                      onClick={() => {
                        const path = generatePath(
                          "lista-arquivos-de-lote?type=status_cartao",
                        );
                        history.push(path);
                      }}
                    />

                    <TableHeaderButton
                      text="Segunda via em lote"
                      onClick={() => {
                        const path = generatePath(
                          "lista-arquivos-de-lote?type=segunda_via_cartao",
                        );
                        history.push(path);
                      }}
                    />
                  </>
                )}

              {hasPermission(PERMISSIONS.secretarias.cartoes.actions) && (
                <>
                  <TableHeaderButton
                    text="Atualizar status"
                    onClick={() => setShowAlterarSelecionadosModal("status")}
                  />

                  <TableHeaderButton
                    text="Solicitar segunda via"
                    onClick={() => {
                      if (registros.length === 0) {
                        toast.warning("Selecione algum cartão para continuar");
                        return;
                      }
                      setShowAlterarSelecionadosModal("segunda_via");
                    }}
                  />

                  <TableHeaderButton
                    text="Selecionar todos"
                    onClick={handleSelectAll}
                    Icon={Check}
                  />
                </>
              )}

              {hasPermission(PERMISSIONS.secretarias.cartoes.create) && (
                <TableHeaderButton
                  text="Novo cadastro"
                  onClick={() => setShowModalNovoCadastro(true)}
                  Icon={Add}
                />
              )}

              <TableHeaderButton
                text="Segunda via"
                onClick={() => {
                  const path = generatePath(
                    "/dashboard/gerenciar-contas/:id/segunda-via-cartao",
                    {
                      id,
                    },
                  );

                  history.push(path);
                }}
                Icon={ListAlt}
              />

              <ExportTableButtons
                token={token}
                path={"beneficiario/cartoes-privados"}
                page={page}
                filters={filters}
                hasPermission={hasPermission(
                  PERMISSIONS.secretarias.cartoes.export,
                )}
              />
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
                      <MenuOptionsTable
                        row={row}
                        getData={getData}
                        deleteCallback={
                          hasPermission(PERMISSIONS.secretarias.cartoes.actions)
                            ? deleteCartao
                            : null
                        }
                        JSONResponse={
                          hasPermission(PERMISSIONS.secretarias.cartoes.actions)
                            ? row?.response
                            : null
                        }
                        blockUnblockCard={hasPermission(
                          PERMISSIONS.secretarias.cartoes.actions,
                        )}
                        cancelCard={hasPermission(
                          PERMISSIONS.secretarias.cartoes.actions,
                        )}
                        logsAuditoria={"cartao_privado"}
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
        tipo="cartao"
        show={showModalNovoCadastro}
        setShow={setShowModalNovoCadastro}
        getData={getData}
      />

      <AlterarSelecionadosModal
        show={showAlterarSelecionadosModal}
        setShow={setShowAlterarSelecionadosModal}
        getData={getData}
        filters={filters}
        registros={registros}
        setRegistros={setRegistros}
      />
    </Box>
  );
}

function AlterarSelecionadosModal({
  show = false, // false, status, segunda_via
  setShow = () => null,
  getData = () => null,
  filters = "",
  registros = [],
  setRegistros = () => null,
}) {
  const token = useAuth();
  const [loading, setLoading] = useState(false);
  const [novoStatus, setNovoStatus] = useState("aguardando"); //“aguardando” “bloqueado”
  const [motivo, setMotivo] = useState({
    id: 0,
    nome: "",
    exigeDescricao: false,
    descricao: "",
  });
  const [dataAgendamento, setDataAgendamento] = useState(null);
  const classes = styles();

  function handleClose() {
    setShow(false);
    setNovoStatus("aguardando");
    setMotivo({
      id: 0,
      nome: "",
      exigeDescricao: false,
      descricao: "", // Se exigeDescricao for true
    });
    setDataAgendamento(null);
  }

  const message = () => {
    switch (show) {
      case "status":
        return "alterar o status";
      case "segunda_via":
        return "solicitar segunda via";
      default:
        return "erro";
    }
  };

  async function handleSubmit() {
    setLoading(true);
    try {
      if (show === "status") {
        await postCartoesTrocarStatus(
          token,
          "", //id comes from filters
          "", //all pages
          filters,
          novoStatus,
          dataAgendamento,
          registros,
        );
      }
      if (show === "segunda_via") {
        await postSegundaViaCriar(
          token,
          motivo?.id,
          registros,
          motivo?.descricao,
        );
      }
      toast.success(`Sucesso ao ${message()}!`);
      getData(token);
      setRegistros([]);
      handleClose();
    } catch (err) {
      console.log(err);
      toast.error(
        `Ocorreu um erro ao ${message()}. Tente novamente mais tarde`,
      );
    }
    setLoading(false);
  }

  function chooseText() {
    if (!registros?.length || registros?.length < 1)
      return `Você gostaria de ${message()} de todos os cartões filtrados?`;
    if (registros?.length === 1)
      return `Você gostaria de ${message()} de 1 cartão selecionado?`;
    if (registros?.length > 1)
      return `Você gostaria de ${message()} de ${registros?.length
        } cartões selecionados?`;
  }

  return (
    <Modal open={!!show} onClose={handleClose}>
      <Box className={classes.modal}>
        <Box className={classes.closeModalButton} onClick={handleClose}>
          <Close />
        </Box>

        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "30px",
          }}
        >
          <Typography
            style={{
              fontFamily: "Montserrat-ExtraBold",
              fontSize: "16px",
              color: APP_CONFIG.mainCollors.primary,
              fontWeight: "bold",
              textTransform: "initial",
            }}
          >
            {message().charAt(0).toLocaleUpperCase() + message().substring(1)}
          </Typography>

          <Typography style={{ marginBottom: "30px" }}>
            {chooseText()}
          </Typography>

          {show === "segunda_via" && (
            <SelectSegundaViaMotivo
              state={motivo}
              setState={(e) => setMotivo(e.target.value)}
            />
          )}
          {show === "segunda_via" && motivo.exigeDescricao && (
            <TextField
              fullWidth
              placeholder="Descrição"
              variant="outlined"
              value={motivo.descricao}
              onChange={(e) => {
                setMotivo((prev) => ({
                  ...prev,
                  descricao: e.target.value,
                }));
              }}
            />
          )}

          {show === "status" && (
            <>
              <InputLabel id="status-label" shrink="true">
                Novo status
              </InputLabel>
              <Select
                labelId="status-label"
                value={novoStatus}
                onChange={(e) => setNovoStatus(e.target.value)}
                variant="outlined"
                fullWidth
              >
                <MenuItem value={"aguardando"}>Aguardando</MenuItem>
                <MenuItem value={"bloqueado"}>Bloqueado</MenuItem>
              </Select>

              <Box style={{ marginBottom: "16px" }}></Box>

              {/* <TextField
                fullWidth
                label="Data de agendamento"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
                }}
                type="date"
                value={dataAgendamento}
                onChange={(e) => setDataAgendamento(e.target.value)}
              /> */}
            </>
          )}

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "30px",
              alignItems: "center",
            }}
          >
            <Box style={{ marginTop: "24px" }}>
              <CustomButton
                variant="contained"
                color="purple"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  Continuar
                </Typography>
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
