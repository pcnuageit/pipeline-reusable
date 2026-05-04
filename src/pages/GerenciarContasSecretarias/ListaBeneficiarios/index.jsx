import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { Add, Delete, RemoveRedEye } from "@material-ui/icons";
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
  deleteBeneficiario,
  getBeneficiarios,
} from "../../../services/beneficiarios";
import px2vw from "../../../utils/px2vw";

import CustomTable from "../../../components/CustomTable/CustomTable";
import { ExportTableButtons } from "../../../components/ExportTableButtons";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import { ModalManager } from "../../../components/ModalManager";
import SelectBeneficio from "../../../components/SelectBeneficio";
import SelectCidade from "../../../components/SelectCidade";
import TableHeaderButton from "../../../components/TableHeaderButton";
import usePermission from "../../../hooks/usePermission";
import { documentMask } from "../../../utils/documentMask";

moment.locale("pt-br");

export default function ListaBeneficiarios() {
  const token = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const id = useParams()?.id ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
    razao_social: "",
    celular: "",
    numero_inscricao: "",
    tipo_beneficio_id: [],
    cidade: [],
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [showModalNovoCadastro, setShowModalNovoCadastro] = useState(false);
  const [showModalModalPrograms, setShowModalModalPrograms] = useState(false);
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

  const columns = [
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (created_at) => (
        <Typography>{moment.utc(created_at).format("DD/MM/YY")}</Typography>
      ),
    },
    { headerText: "Nome", key: "nome" },
    { headerText: "Secretaria", key: "conta.razao_social" },
    {
      headerText: "CPF",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
    { headerText: "Cidade", key: "concorrencia_endereco.cidade" },
    { headerText: "Inscrição/Chapa", key: "numero_inscricao" },
    hasPermission(PERMISSIONS.beneficiarios.actions.view_program)
      ? {
          headerText: "PROGRAMAS",
          key: "",
          FullObject: (obj) => (
            <RemoveRedEye onClick={() => setShowModalModalPrograms(obj)} />
          ),
        }
      : {},
    { headerText: "", key: "menu" },
  ];

  const resetFilters = () => {
    setPage(1);
    setFilter({
      nome: "",
      documento: "",
      razao_social: "",
      celular: "",
      numero_inscricao: "",
      tipo_beneficio_id: [],
      cidade: [],
      mostrar: "15",
    });
  };

  const filters = `conta_id=${id}&nome=${filter.nome}&documento=${
    filter.documento
  }&celular=${filter.celular}&numero_inscricao=${
    filter.numero_inscricao
  }&razao_social=${filter.razao_social}&tipo_beneficio_id=${JSON.stringify(
    filter.tipo_beneficio_id,
  )}&cidade=${JSON.stringify(filter.cidade)}&mostrar=${filter.mostrar}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getBeneficiarios(token, id, page, filters);
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
          <Typography className={useStyles.pageTitle}>
            Contas Beneficiários
          </Typography>

          {hasPermission(PERMISSIONS.beneficiarios.list.update_extract) && (
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
            {hasPermission(PERMISSIONS.beneficiarios.list.search) && (
              <Grid container spacing={3}>
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
                    placeholder="Pesquisar por celular"
                    size="small"
                    variant="outlined"
                    value={filter.celular}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        celular: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por inscrição/chapa"
                    size="small"
                    variant="outlined"
                    value={filter.numero_inscricao}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        numero_inscricao: e.target.value,
                      }));
                    }}
                  />
                </Grid>

                {/* <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    placeholder="Pesquisar por secretaria"
                    size="small"
                    variant="outlined"
                    
                    value={filter.razao_social}
                    onChange={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        razao_social: e.target.value,
                      }));
                    }}
                  />
                </Grid> */}

                <Grid item xs={12} sm={4}>
                  <SelectBeneficio
                    state={filter?.tipo_beneficio_id}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        tipo_beneficio_id: e.target.value,
                      }));
                    }}
                    multiple
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <SelectCidade
                    state={filter?.cidade}
                    setState={(e) => {
                      setPage(1);
                      setFilter((prev) => ({
                        ...prev,
                        cidade: e.target.value,
                      }));
                    }}
                    multiple
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
              {hasPermission(PERMISSIONS.beneficiarios.list.search) && (
                <TableHeaderButton
                  Icon={Delete}
                  text="Limpar"
                  color="red"
                  onClick={resetFilters}
                />
              )}

              {id ? (
                <>
                  {hasPermission(
                    PERMISSIONS.secretarias.beneficiarios.batch_upload,
                  ) && (
                    <TableHeaderButton
                      text="Arquivos em lote"
                      onClick={() => {
                        const path = generatePath(
                          "lista-arquivos-de-lote?type=beneficiario",
                        );
                        history.push(path);
                      }}
                    />
                  )}

                  {hasPermission(
                    PERMISSIONS.secretarias.beneficiarios.create,
                  ) && (
                    <TableHeaderButton
                      text="Novo cadastro"
                      onClick={() => setShowModalNovoCadastro(true)}
                      Icon={Add}
                    />
                  )}
                </>
              ) : null}

              <ExportTableButtons
                token={token}
                path={"beneficiario"}
                page={page}
                filters={filters}
                hasPermission={hasPermission(
                  PERMISSIONS.beneficiarios.list.export,
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

        {hasPermission(PERMISSIONS.beneficiarios.list.view) && (
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
                          hasPermission(
                            PERMISSIONS.beneficiarios.actions.delete,
                          )
                            ? deleteBeneficiario
                            : null
                        }
                        editType={
                          hasPermission(PERMISSIONS.beneficiarios.actions.edit)
                            ? "beneficiario"
                            : null
                        }
                        transactionsType="beneficiario"
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
        tipo="beneficiario"
        show={showModalNovoCadastro}
        setShow={setShowModalNovoCadastro}
        getData={getData}
      />

      <ModalPrograms
        show={showModalModalPrograms}
        setShow={setShowModalModalPrograms}
      />
    </Box>
  );
}

function ModalPrograms({ show, setShow }) {
  const parseData = () => {
    const p = [];
    if (!show) return p;

    show?.concorrencia_cartao?.forEach((obj) => {
      p.push(obj?.tipo_beneficio?.nome_beneficio);
    });
    show?.concorrencia_conta?.forEach((obj) => {
      p.push(obj?.tipo_beneficio?.nome_beneficio);
    });

    return p;
  };

  return (
    <Dialog
      open={show}
      onClose={() => setShow(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Programas</DialogTitle>
      <DialogContent>
        {parseData()?.map((item) => (
          <Typography>{item}</Typography>
        ))}
      </DialogContent>
    </Dialog>
  );
}
