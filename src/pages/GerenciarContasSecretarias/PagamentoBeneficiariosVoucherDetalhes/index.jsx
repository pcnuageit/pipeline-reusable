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
import { Check, ReplayOutlined } from "@material-ui/icons";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { MenuOptionsTable } from "../../../components/MenuOptionsTable";
import TableHeaderButton from "../../../components/TableHeaderButton";
import TextFieldCpfCnpj from "../../../components/TextFieldCpfCnpj";
import { APP_CONFIG } from "../../../constants/config";
import "../../../fonts/Montserrat-SemiBold.otf";
import useAuth from "../../../hooks/useAuth";
import useDebounce from "../../../hooks/useDebounce";
import usePermission from "../../../hooks/usePermission";
import {
  deletePagamentosVoucherLote,
  getTransacoesVoucher,
  patchPagamentosVoucherStatusToCreatedLote,
} from "../../../services/beneficiarios";
import { documentMask } from "../../../utils/documentMask";
import { phoneMask } from "../../../utils/phoneMask";
import pixKeyType from "../../../utils/pixKeyType";
import px2vw from "../../../utils/px2vw";

moment.locale("pt-br");

export default function ListaPagamentoBeneficiariosVoucherDetalhes() {
  const token = useAuth();
  const dispatch = useDispatch();
  const id = useParams()?.subsectionId ?? "";
  const [loading, setLoading] = useState(false);
  const [listaContas, setListaContas] = useState();
  const [filter, setFilter] = useState({
    like: "",
    documento_beneficiario: "",
    status: " ",
  });
  const debouncedFilter = useDebounce(filter, 800);
  const [page, setPage] = useState(1);
  const [registros, setRegistros] = useState([]);
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
    setRegistros([]);
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

  const handleSelectAll = () => {
    let arr = [];
    listaContas?.data.forEach((e) => {
      arr.push(e?.id);
    });
    setRegistros(arr);
  };

  const handleResetStatus = async (e) => {
    e.preventDefault();

    if (registros?.length < 1) {
      toast.error("Selecione pelo menos um item para reverter o status.");
      return;
    }

    setLoading(true);
    try {
      await patchPagamentosVoucherStatusToCreatedLote(token, registros);
      toast.success("O status dos items foram revertidos.");
      await getData(token);
      setRegistros([]);
    } catch (err) {
      console.log(err);
      toast.error(
        "Ocorreu um erro, não possivel alterar o status dos items. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePagamento = async (id) => {
    setLoading(true);
    try {
      await deletePagamentosVoucherLote(token, id);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const columns = [
    {
      headerText: "",
      key: "",
      FullObject: (obj) => {
        return (
          <>
            <Box>
              <Checkbox
                color="primary"
                checked={registros.some((item) => item === obj?.id)}
                onChange={() => {
                  if (registros.some((item) => item === obj?.id)) {
                    setRegistros(registros.filter((item) => item !== obj?.id));
                  } else {
                    setRegistros([...registros, obj?.id]);
                  }
                }}
              />
            </Box>
          </>
        );
      },
    },
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
            Detalhes do Pagamento de Voucher
          </Typography>

          {hasPermission(PERMISSIONS.secretarias.pagamento_voucher.actions) && (
            <Box style={{ alignSelf: "flex-end" }}>
              <IconButton
                style={{
                  backgroundColor: APP_CONFIG.mainCollors.backgrounds,
                  color: APP_CONFIG.mainCollors.primary,
                }}
                onClick={() => window.location.reload(false)}
              >
                <RefreshIcon />
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
            <Grid
              container
              spacing={3}
              style={{ alignItems: "center", marginBottom: "8px" }}
            >
              {hasPermission(
                PERMISSIONS.secretarias.pagamento_voucher.view,
              ) && (
                <>
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
                </>
              )}

              {hasPermission(
                PERMISSIONS.secretarias.pagamento_voucher.actions,
              ) && (
                <>
                  <TableHeaderButton
                    text="Selecionar todos"
                    onClick={handleSelectAll}
                    Icon={Check}
                  />

                  <TableHeaderButton
                    text="Reverter selecionados"
                    onClick={handleResetStatus}
                    Icon={ReplayOutlined}
                    hasPermission={hasPermission(
                      PERMISSIONS.secretarias.pagamento_voucher
                        .reverter_pagamentos,
                    )}
                  />
                </>
              )}
            </Grid>
          </Box>
        </Box>

        {hasPermission(PERMISSIONS.secretarias.pagamento_voucher.view) && (
          <Box className={useStyles.tableContainer}>
            {!loading && listaContas?.data ? (
              <Box minWidth={!matches ? "800px" : null}>
                <TableContainer style={{ overflowX: "auto" }}>
                  <CustomTable
                    data={listaContas?.data}
                    columns={columns}
                    Editar={({ row }) => (
                      <MenuOptionsTable
                        row={row}
                        getData={getData}
                        patchStatus={
                          row?.status === "Aprovado" ? null : "voucher"
                        }
                        JSONResponse={
                          !hasPermission(
                            PERMISSIONS.secretarias.pagamento_voucher
                              .consultar_json,
                          )
                            ? null
                            : (row?.pagamento_pix?.response?.webhook?.data ??
                              row?.response?.error ??
                              (row?.status === "Pendente" && row?.response) ??
                              (row?.status === "Aguardando" && row?.response))
                        }
                        deleteCallback={() => handleDeletePagamento(row?.id)}
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
    </Box>
  );
}
