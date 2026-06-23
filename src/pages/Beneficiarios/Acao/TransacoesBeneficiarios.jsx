import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Delete, Print } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { generatePath } from "react-router-dom/cjs/react-router-dom.min";
import { loadUserData } from "../../../actions/actions";
import CustomButton from "../../../components/CustomButton/CustomButton";
import CustomCurrencyInput from "../../../components/CustomCurrencyInput";
import CustomHeader from "../../../components/CustomHeader/CustomHeader";
import CustomTable from "../../../components/CustomTable/CustomTable";
import SelectBeneficio from "../../../components/SelectBeneficio";
import SelectCidade from "../../../components/SelectCidade";
import ExportTableButtons from "../../../components/TableHeaderButtons/ExportTableButtons";
import TableHeaderButton from "../../../components/TableHeaderButtons/TableHeaderButton";
import TextFieldCpfCnpj from "../../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../../constants/config";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import {
  getBeneficiarios,
  getHistoricoTransacoes,
} from "../../../services/beneficiarios";
import { documentMask } from "../../../utils/documentMask";
import translateCardTransactionType from "../../../utils/translateCardTransactionType";
import { translateStatus } from "../../../utils/translateStatus";

moment.locale();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    padding: "10px",
  },
  header: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dadosBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: "24px",
    marginLeft: "0px",
  },
  cardContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  contadorStyle: {
    display: "flex",
    fontSize: "30px",
    fontFamily: "Montserrat-SemiBold",
  },
}));

const columns = [
  {
    headerText: "Data",
    key: "",
    FullObject: (data) => {
      return (
        <Typography align="center">
          {moment(data?.data_transacao ?? data?.created_at).format(
            "DD/MM/YYYY HH:mm",
          )}
        </Typography>
      );
    },
  },
  {
    headerText: "NSU",
    key: "nsu",
  },
  {
    headerText: "Tipo",
    key: "tipo_operacao",
    CustomValue: (tipo) => (
      <Typography>{translateCardTransactionType(tipo)}</Typography>
    ),
  },
  {
    headerText: "Valor",
    key: "valor",
    CustomValue: (valor) => {
      return (
        <Box>
          R${" "}
          {parseFloat(valor).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Box>
      );
    },
  },
  // {
  //   headerText: "Valor da taxa",
  //   key: "valor_taxa",
  //   CustomValue: (valor) => {
  //     return (
  //       <Box>
  //         R${" "}
  //         {parseFloat(valor).toLocaleString("pt-br", {
  //           minimumFractionDigits: 2,
  //           maximumFractionDigits: 2,
  //         })}
  //       </Box>
  //     );
  //   },
  // },
  // {
  //   headerText: "Valor líquido",
  //   key: "valor_liquido",
  //   CustomValue: (valor) => {
  //     return (
  //       <Box>
  //         R${" "}
  //         {parseFloat(valor).toLocaleString("pt-br", {
  //           minimumFractionDigits: 2,
  //           maximumFractionDigits: 2,
  //         })}
  //       </Box>
  //     );
  //   },
  // },
  {
    headerText: "Origem",
    key: "is_seeded",
    CustomValue: (v) => <Typography>{v ? "PDV" : "QR code"}</Typography>,
  },
  {
    headerText: "Status",
    key: "status",
    CustomValue: (data) => (
      <Typography style={data === "pending" ? { color: "orange" } : {}}>
        {translateStatus(data)}
      </Typography>
    ),
  },
  {
    headerText: "Cidade",
    key: "transactionable_to.endereco.cidade",
  },
  {
    headerText: "Beneficiário",
    key: "transactionable_from",
    CustomValue: (data) => (
      <>
        <Typography>{data?.razao_social ?? data?.nome}</Typography>
        <Typography>{data?.cnpj ?? data?.documento}</Typography>
      </>
    ),
  },
  {
    headerText: "Benefício",
    key: "concorrencia_cartao.tipo_beneficio.nome_beneficio",
  },
  {
    headerText: "Credenciado",
    key: "transactionable_to",
    CustomValue: (data) => (
      <>
        <Typography>{data?.razao_social ?? data?.nome}</Typography>
        <Typography>{data?.cnpj ?? data?.documento}</Typography>
      </>
    ),
  },
  {
    headerText: "Cartão",
    key: "concorrencia_cartao.external_msk",
    CustomValue: (v) => <Typography>{v?.replace(/\D/g, "")}</Typography>,
  },
  {
    headerText: "",
    key: "menu",
  },
];

export default function TransacoesBeneficiarios() {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.me);
  const token = useAuth();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [extratoConcorrencia, setExtratoConcorrencia] = useState("");
  const [page, setPage] = useState(1);
  const [showSelecionarBeneficiarioModal, setShowSelecionarBeneficiarioModal] =
    useState(false);
  const [filter, setFilter] = useState({
    documento_conta: "",
    documento_beneficiario: "",
    tipo_beneficio_id: "",
    data_inicio: "",
    data_fim: "",
    cidade: "",
    nsu: "",
    valor_minimo: "",
    valor_maximo: "",
    origem: " ", //pdfv qr_code
    status: " ", // succeeded pending failed rejected canceled
    nome_beneficiario: "",
    nome_estabelecimento: "",
    mostrar: "15",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const resetFilter = () => {
    setPage(1);
    setFilter({
      documento_conta: "",
      documento_beneficiario: "",
      tipo_beneficio_id: "",
      data_inicio: "",
      data_fim: "",
      cidade: "",
      nsu: "",
      valor_minimo: "",
      valor_maximo: "",
      origem: " ",
      status: " ",
      nome_beneficiario: "",
      nome_estabelecimento: "",
      mostrar: "15",
    });
  };

  const beneficiosPermissions = me?.tipo_beneficios.map((obj) => obj?.id);
  const filters = `tipo_beneficio_ids=${JSON.stringify(
    beneficiosPermissions,
  )}&documento_conta=${
    debouncedFilter.documento_conta
  }&documento_beneficiario=${
    debouncedFilter.documento_beneficiario
  }&tipo_beneficio_id=${debouncedFilter.tipo_beneficio_id}&data_inicio=${
    debouncedFilter.data_inicio
  }&data_fim=${debouncedFilter.data_fim}&per_page=${
    debouncedFilter.mostrar
  }&cidade=${debouncedFilter.cidade}&valor_minimo=${
    debouncedFilter.valor_minimo
  }&valor_maximo=${debouncedFilter.valor_maximo}&origem=${
    debouncedFilter.origem
  }&status=${debouncedFilter.status}&nome_beneficiario=${
    debouncedFilter.nome_beneficiario
  }&nome_estabelecimento=${debouncedFilter.nome_estabelecimento}&nsu=${
    debouncedFilter.nsu
  }`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getHistoricoTransacoes(token, page, filters);
      setExtratoConcorrencia(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(page);
  }, [token, page, debouncedFilter]);

  useEffect(() => {
    dispatch(loadUserData(token));
  }, [token, dispatch]);

  const Editar = ({ row }) => {
    const redirectPrintFolha = () => {
      const path = generatePath(
        `/dashboard/print/:id??type=comprovante_transacoes_cartao`,
        {
          id: row?.id,
        },
      );

      const newWindow = window.open(path, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    };

    return (
      <Print
        onClick={redirectPrintFolha}
        style={{ color: APP_CONFIG.mainCollors.primary }}
      />
    );
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>
        <CustomHeader pageTitle="Transações Cartão" />

        <Box className={classes.dadosBox}>
          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              style={{
                display: "flex",
                backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                borderRadius: "17px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  borderTopLeftRadius: 27,
                  borderTopRightRadius: 27,
                }}
              >
                <Box
                  style={{
                    marginTop: "10px",
                    marginBottom: "16px",
                    margin: 30,
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                          pattern: "d {4}- d {2}- d {2} ",
                        }}
                        type="date"
                        label="Data inicial"
                        value={filter.data_inicio}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            data_inicio: e.target.value,
                          });
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          color: APP_CONFIG.mainCollors.secondary,
                          shrink: true,
                          pattern: "d {4}- d {2}- d {2} ",
                        }}
                        type="date"
                        label="Data final"
                        value={filter.data_fim}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            data_fim: e.target.value,
                          });
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <SelectBeneficio
                        state={filter?.tipo_beneficio_id}
                        setState={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            tipo_beneficio_id: e.target.value,
                          }));
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <SelectCidade
                        state={filter?.cidade}
                        setState={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            cidade: e.target.value,
                          }));
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Nome do beneficiário"
                        value={filter.nome_beneficiario}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            nome_beneficiario: e.target.value,
                          });
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <ReactInputMask
                        mask={"999.999.999-99"}
                        value={filter.documento_beneficiario}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            documento_beneficiario: e.target.value,
                          });
                        }}
                      >
                        {() => (
                          <TextField
                            fullWidth
                            placeholder="Documento do beneficiário"
                            variant="outlined"
                          />
                        )}
                      </ReactInputMask>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Nome do estabelecimento"
                        value={filter.nome_estabelecimento}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            nome_estabelecimento: e.target.value,
                          });
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextFieldCpfCnpj
                        placeholder="Documento do estabelecimento"
                        value={filter.documento_conta}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            documento_conta: e.target.value,
                          });
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <TextField
                        label="NSU"
                        value={filter.nsu}
                        onChange={(e) => {
                          setPage(1);
                          setFilter({
                            ...filter,
                            nsu: e.target.value,
                          });
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <CustomCurrencyInput
                      label="Valor mínimo"
                      value={filter.valor_minimo}
                      onChangeEvent={(event, maskedvalue, floatvalue) => {
                        setPage(1);
                        setFilter({
                          ...filter,
                          valor_minimo: floatvalue,
                        });
                      }}
                      gridSizeSm={2}
                    />

                    <CustomCurrencyInput
                      label="Valor máximo"
                      value={filter.valor_maximo}
                      onChangeEvent={(event, maskedvalue, floatvalue) => {
                        setPage(1);
                        setFilter({
                          ...filter,
                          valor_maximo: floatvalue,
                        });
                      }}
                      gridSizeSm={2}
                    />

                    <Grid item xs={12} sm={2}>
                      <InputLabel id="origem_label" shrink="true">
                        Origem
                      </InputLabel>
                      <Select
                        labelId="origem_label"
                        variant="outlined"
                        fullWidth
                        value={filter.origem}
                        onChange={(e) =>
                          setFilter({ ...filter, origem: e.target.value })
                        }
                      >
                        <MenuItem value={" "}>Todos</MenuItem>
                        <MenuItem value={"pdv"}>PDV</MenuItem>
                        <MenuItem value={"qr_code"}>QR Code</MenuItem>
                      </Select>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <InputLabel id="status_label" shrink="true">
                        Status
                      </InputLabel>
                      <Select
                        labelId="status_label"
                        variant="outlined"
                        fullWidth
                        value={filter.status}
                        onChange={(e) =>
                          setFilter({ ...filter, status: e.target.value })
                        }
                      >
                        <MenuItem value={" "}>Todos</MenuItem>
                        <MenuItem value={"succeeded"}>
                          {translateStatus("succeeded")}
                        </MenuItem>
                        <MenuItem value={"pending"}>
                          {translateStatus("pending")}
                        </MenuItem>
                        <MenuItem value={"failed"}>
                          {translateStatus("failed")}
                        </MenuItem>
                        <MenuItem value={"rejected"}>
                          {translateStatus("rejected")}
                        </MenuItem>
                        <MenuItem value={"canceled"}>
                          {translateStatus("canceled")}
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
                      onClick={resetFilter}
                    />

                    <ExportTableButtons
                      token={token}
                      path={"transacoes"}
                      page={page}
                      filters={filters}
                    />
                  </Grid>
                </Box>
              </Box>

              {!loading &&
              extratoConcorrencia &&
              extratoConcorrencia.per_page ? (
                <>
                  <Box>
                    <CustomTable
                      data={extratoConcorrencia.data}
                      columns={columns}
                      Editar={Editar}
                    />
                  </Box>
                  <Box alignSelf="start" marginTop="8px">
                    {
                      <Pagination
                        variant="outlined"
                        color="secondary"
                        size="large"
                        count={extratoConcorrencia.last_page}
                        onChange={(e, value) => setPage(value)}
                        page={page}
                      />
                    }
                  </Box>
                </>
              ) : (
                <LinearProgress />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <SelecionarBeneficiarioModal
        show={showSelecionarBeneficiarioModal}
        setShow={setShowSelecionarBeneficiarioModal}
        callback={(id) => {
          setPage(1);
          setFilter({
            ...filter,
            user_id: id,
          });
        }}
      />
    </Box>
  );
}

function SelecionarBeneficiarioModal({
  show = false,
  setShow = () => false,
  callback = () => null,
}) {
  const token = useAuth();
  const [listaBeneficiarios, setListaBeneficiarios] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState("");
  const [filter, setFilter] = useState({
    nome: "",
    documento: "",
  });
  const debouncedFilter = useDebounce(filter, 800);

  const resetFilter = () => {
    setFilter({
      nome: "",
      documento: "",
    });
  };

  const filters = `nome=${filter.nome}&documento=${filter.documento}`;

  const getData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getBeneficiarios(token, "[]", page, filters);
      setListaBeneficiarios(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShow(false);

  useEffect(() => {
    if (show) {
      getData(page);
    }
  }, [token, show, page, debouncedFilter]);

  const columns = [
    { headerText: "NOME", key: "nome" },
    {
      headerText: "DOCUMENTO",
      key: "documento",
      CustomValue: (data) => <Typography>{documentMask(data)}</Typography>,
    },
  ];

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth={"lg"}
      minWidth={"lg"}
      width={"lg"}
      scroll={"paper"}
    >
      <DialogContent style={{ paddingBottom: 40, minWidth: "60%" }}>
        <Grid container spacing={4}>
          <Box>
            <Box
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  borderRadius: "17px",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Box
                  style={{
                    width: "100%",
                    borderRadius: 27,
                    borderTopLeftRadius: 27,
                    borderTopRightRadius: 27,
                  }}
                >
                  <Box style={{ margin: 30 }}>
                    <Grid
                      container
                      spacing={4}
                      style={{ alignItems: "center", marginBottom: "8px" }}
                    >
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Pesquisar por nome"
                          value={filter.nome}
                          onChange={(e) => {
                            setPage(1);
                            setFilter((prev) => ({
                              ...prev,
                              nome: e.target.value,
                            }));
                          }}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Pesquisar por documento"
                          value={filter.documento}
                          onChange={(e) => {
                            setPage(1);
                            setFilter((prev) => ({
                              ...prev,
                              documento: e.target.value,
                            }));
                          }}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                          }}
                        >
                          <CustomButton color="red" onClick={resetFilter}>
                            <Box display="flex" alignItems="center">
                              <Delete />
                              Limpar
                            </Box>
                          </CustomButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {!loading &&
                listaBeneficiarios &&
                listaBeneficiarios.per_page ? (
                  <>
                    <Box>
                      <CustomTable
                        columns={columns}
                        data={listaBeneficiarios.data}
                        handleClickRow={(row) => {
                          handleClose();
                          callback(row.id);
                        }}
                      />
                    </Box>
                    <Box alignSelf="start" marginTop="8px">
                      {
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={listaBeneficiarios.last_page}
                          onChange={(e, value) => setPage(value)}
                          page={page}
                        />
                      }
                    </Box>
                  </>
                ) : (
                  <LinearProgress />
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
