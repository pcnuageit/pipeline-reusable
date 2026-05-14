import {
  Box,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Pagination } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { MenuOptionsTable } from "../../components/MenuOptionsTable";
import { TableHeaderButton } from "../../components/TableHeaderButtons";
import TextFieldCpfCnpj from "../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { getTransacoesVoucher } from "../../services/beneficiarios";
import { documentMask } from "../../utils/documentMask";
import { phoneMask } from "../../utils/phoneMask";
import pixKeyType from "../../utils/pixKeyType";

moment.locale("pt-br");

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
    marginTop: "30px",
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
  paper: {
    backgroundColor: APP_CONFIG.mainCollors.backgrounds,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    boxShadow: "none",
    borderRadius: "0px",
    alignSelf: "center",
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
  },
}));

const columns = [
  {
    headerText: "Nome",
    key: "conta.user.nome",
    CustomValue: (nome) => <Typography>{nome}</Typography>,
  },
  {
    headerText: "Email",
    key: "conta.user.email",
    CustomValue: (email) => <Typography>{email}</Typography>,
  },
  {
    headerText: "CPF",
    key: "conta.user.documento",
    CustomValue: (documento) => (
      <Typography>{documentMask(documento)}</Typography>
    ),
  },
  {
    headerText: "Contato",
    key: "conta.user.celular",
    CustomValue: (celular) => (
      <Typography>{celular ? phoneMask(celular) : "*"}</Typography>
    ),
  },
  {
    headerText: "TIPO DE CHAVE PIX",
    key: "conta",
    CustomValue: (conta) => {
      if (conta?.tipo_transferencia === "Manual") {
        return <Typography>-</Typography>;
      } else {
        return <Typography>{pixKeyType(conta?.chave_pix)}</Typography>;
      }
    },
  },
  {
    headerText: "Dados",
    key: "conta",
    CustomValue: (conta) => {
      if (conta?.tipo_transferencia === "Manual") {
        return (
          <Typography>{`${conta?.banco} ${conta?.agencia} ${conta?.conta_sem_digito}-${conta?.digito_conta}`}</Typography>
        );
      } else {
        return <Typography>{conta?.chave_pix}</Typography>;
      }
    },
  },
  {
    headerText: "Valor",
    key: "valor_pagamento",
    CustomValue: (valor) => (
      <Typography style={{ lineBreak: "auto" }}>
        R$
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },
  {
    headerText: "Tipo Pagamento",
    key: "tipo_pagamento",
    CustomValue: (tipo_pagamento) => (
      <Typography style={{ lineBreak: "loose" }}>{tipo_pagamento}</Typography>
    ),
  },
  {
    headerText: "Status Transação",
    key: "status",
    CustomValue: (status) => (
      <Typography style={{ lineBreak: "loose" }}>
        {status === "Pedente" ? "Pendente" : status}
      </Typography>
    ),
  },
  {
    headerText: "",
    key: "menu",
  },
];

export default function ListaFolhaDePagamentoVoucherDetalhes() {
  const token = useAuth();
  const id = useParams()?.subsectionId ?? "";
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    like: "",
    documento_beneficiario: "",
    status: " ",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);

  const resetFilters = () => {
    setPage(1);
    setFilter({
      like: "",
      documento_beneficiario: "",
      status: " ",
    });
  };

  const filters = `pagamento_aluguel_id=${id}&like=${filter.like}&documento_beneficiario=${filter.documento_beneficiario}&status=${filter.status}`;

  const getData = async (token, page = 1) => {
    setLoading(true);
    try {
      const { data } = await getTransacoesVoucher(token, page, filters);
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
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />

      <Box className={classes.main}>
        <CustomHeader
          pageTitle="Detalhes do Pagamento de Voucher"
          arquivosLote
          routeForGestao={"voucher"}
        />

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
                alignItems: "center",
                borderRadius: "17px",
                flexDirection: "column",
                minWidth: "100%",
              }}
            >
              <Box
                style={{
                  width: "100%",
                  borderRadius: 27,
                }}
              >
                <Box style={{ margin: "30px" }}>
                  <Grid
                    container
                    spacing={3}
                    style={{ alignItems: "center", marginBottom: "8px" }}
                  >
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        placeholder="Pesquisar por Nome ou Email"
                        size="small"
                        variant="outlined"
                        value={filter.like}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            like: e.target.value,
                          }));
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextFieldCpfCnpj
                        placeholder="Pesquisar por documento"
                        value={filter.documento_beneficiario}
                        onChange={(e) => {
                          setPage(1);
                          setFilter((prev) => ({
                            ...prev,
                            documento_beneficiario: e.target.value,
                          }));
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <InputLabel id="status_id" shrink>
                        Status
                      </InputLabel>
                      <Select
                        labelId="status_id"
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
                        <MenuItem value={"created"}>Aguardando</MenuItem>
                        <MenuItem value={"confirmed"}>Confirmado</MenuItem>
                        <MenuItem value={"pending"}>Pendente</MenuItem>
                        <MenuItem value={"succeeded"}>Aprovado</MenuItem>
                        <MenuItem value={"failed"}>Falha</MenuItem>
                        <MenuItem value={"rejected"}>Rejeitado</MenuItem>
                        <MenuItem value={"excluido"}>Excluído</MenuItem>
                        <MenuItem value={"ErrorBalance"}>Erro Saldo</MenuItem>
                        <MenuItem value={"Error"}>Erro</MenuItem>
                      </Select>
                    </Grid>

                    <TableHeaderButton
                      text="Limpar"
                      onClick={resetFilters}
                      color="red"
                    />
                  </Grid>
                </Box>

                <Box
                  style={{
                    width: "100%",
                    borderTopRightRadius: 27,
                    borderTopLeftRadius: 27,
                  }}
                >
                  {!loading && listaContas?.data && listaContas?.per_page ? (
                    <>
                      <Box minWidth={!matches ? "800px" : null}>
                        <TableContainer style={{ overflowX: "auto" }}>
                          <CustomTable
                            data={listaContas?.data}
                            columns={columns}
                            Editar={({ row }) => (
                              <MenuOptionsTable
                                row={row}
                                getData={getData}
                                // patchStatus={
                                //   row?.status === "Aprovado" ? null : "voucher"
                                // }
                                JSONResponse={
                                  row?.pagamento_pix?.response?.webhook?.data ??
                                  row?.response?.error ??
                                  (row?.status === "Pendente" &&
                                    row?.response) ??
                                  (row?.status === "Aguardando" &&
                                    row?.response)
                                }
                              />
                            )}
                          />
                        </TableContainer>
                      </Box>
                      <Box alignSelf="flex-end" marginTop="8px">
                        <Pagination
                          variant="outlined"
                          color="secondary"
                          size="large"
                          count={listaContas?.last_page}
                          onChange={(e, value) => setPage(value)}
                          page={page}
                        />
                      </Box>
                    </>
                  ) : (
                    <Box>
                      <LinearProgress color="secondary" />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
