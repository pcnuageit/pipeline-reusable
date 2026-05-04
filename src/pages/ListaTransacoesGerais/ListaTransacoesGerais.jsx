/* eslint-disable no-lone-blocks */

import "../../fonts/Montserrat-SemiBold.otf";

import {
  Box,
  Grid,
  IconButton,
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory } from "react-router";
import {
  loadExportHistoricoTransacao,
  loadHistoricoTransacaoFilter,
} from "../../actions/actions";

import { faTable, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import { Tooltip } from "@mui/material";
import moment from "moment";
import "moment/locale/pt-br";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import px2vw from "../../utils/px2vw";

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data_criacao) => {
      const date = new Date(data_criacao);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const formatted = date.toLocaleDateString("pt-br", option);
      return <Typography align="center">{formatted}</Typography>;
    },
  },
  {
    headerText: "EC",
    key: "conta",
    CustomValue: (conta) => (
      <Box display="flex" flexDirection="column">
        <Typography>
          {conta.razao_social ? conta.razao_social : conta.nome}
        </Typography>
      </Box>
    ),
  },
  {
    headerText: "Pagador",
    key: "pagador",
    CustomValue: (pagador) => (
      <Box display="flex" flexDirection="column">
        <Typography>{pagador ? pagador.nome : null}</Typography>
        <Typography>{pagador ? pagador.documento : null}</Typography>
      </Box>
    ),
  },
  {
    headerText: "Situação",
    key: "transaction.status",
    CustomValue: (status) => {
      if (status === "succeeded") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            SUCESSO
          </Typography>
        );
      }
      if (status === "failed") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            FALHADA
          </Typography>
        );
      }
      if (status === "canceled") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            CANCELADA
          </Typography>
        );
      }
      if (status === "pending") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            PENDENTE
          </Typography>
        );
      }
      if (status === "new") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            NOVO
          </Typography>
        );
      }
      if (status === "pre_authorized") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            PRÉ-AUTORIZADO
          </Typography>
        );
      }
      if (status === "reversed") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            REVERTIDO
          </Typography>
        );
      }
      if (status === "refunded") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            REEMBOLSADO
          </Typography>
        );
      }
      if (status === "dispute") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            DISPUTA
          </Typography>
        );
      }
      if (status === "charged_back") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            DEBITADO
          </Typography>
        );
      }
      if (status === "requested") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            CANC. SOLICITADO
          </Typography>
        );
      }
      if (status === "refused") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            CANC. RECUSADO POR STATUS
          </Typography>
        );
      }
      if (status === "rejected") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            CANC. REJEITADO
          </Typography>
        );
      }
      if (status === "error") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            ERRO CANCELAMENTO
          </Typography>
        );
      }
      if (status === "finished") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            CANC. FINALIZADO
          </Typography>
        );
      }
    },
  },
  {
    headerText: "Validação",
    key: "",
    FullObject: (data) => (
      <Box display="flex" flexDirection="column">
        {data.transaction &&
        data.transaction.error &&
        data.transaction.error.message_display ? (
          data.transaction.error.message_display
        ) : (
          <Typography style={{ color: "green" }}>APROVADO</Typography>
        )}
      </Box>
    ),
  },
  {
    headerText: "Tipo",
    key: "transaction",
    CustomValue: (transaction) => {
      const type = transaction.payment_type;
      if (type === "credit") {
        const installments = transaction.installment_plan
          ? transaction.installment_plan.number_installments
          : 1;
        const flag = transaction.payment_method.card_brand;
        return (
          <Typography>
            Crédito {installments}x - {flag}
          </Typography>
        );
      }
      if (type === "debit") {
        return <Typography>Débito</Typography>;
      }
      if (type === "boleto") {
        return <Typography>Boleto</Typography>;
      }
      if (type === "commission") {
        return <Typography>Comissão</Typography>;
      }
    },
  },
  {
    headerText: "Valor Bruto",
    key: "transaction.amount",
    CustomValue: (value) => <Typography>R${value}</Typography>,
  },
  {
    headerText: "Valor da taxa",
    key: "transaction.fees",
    CustomValue: (value) => <Typography>R${value}</Typography>,
  },

  {
    headerText: "Valor Líquido",
    key: "transaction",
    CustomValue: (transaction) => {
      const { fees, amount } = transaction;
      const valorLiquido = (amount - fees).toFixed(2);
      return <Typography>R${valorLiquido}</Typography>;
    },
  },
];

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
}));

const ListaTransacoesGerais = () => {
  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const dispatch = useDispatch();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles();
  const historico = useSelector((state) => state.historicoTransacao);

  moment.locale("pt-br");

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const [filters, setFilters] = useState({
    day: " ",
    order: "",
    mostrar: "",
    status: " ",
    like: "",
    payment_type: " ",
    data_inicial: "",
    data_final: "",
    id: "",
    terminal_id: "",
    documento: "",
    vencimento_inicial: "",
    vencimento_final: "",
    pagamento_inicial: "",
    pagamento_final: "",
    seller_like: "",
    holder_name: "",
    is_physical_sale: " ",
  });

  const [filtersComparation] = useState({
    day: " ",
    order: "",
    mostrar: "",
    status: " ",
    like: "",
    payment_type: " ",
    data_inicial: "",
    data_final: "",
    id: "",
    terminal_id: "",
    documento: "",
    vencimento_inicial: "",
    vencimento_final: "",
    pagamento_inicial: "",
    pagamento_final: "",
    seller_like: "",
    holder_name: "",
    is_physical_sale: " ",
  });

  const debouncedLike = useDebounce(filters.like, 800);
  const debouncedId = useDebounce(filters.id, 800);

  useEffect(() => {
    dispatch(
      loadHistoricoTransacaoFilter(
        token,
        page,
        filters.day,
        filters.order,
        filters.mostrar,
        filters.status,
        debouncedLike,
        filters.payment_type,
        filters.data_inicial,
        filters.data_final,
        debouncedId,
        filters.documento,
        filters.vencimento_inicial,
        filters.vencimento_final,
        filters.pagamento_inicial,
        filters.pagamento_final,
        "",
        filters.terminal_id,
        filters.seller_like,
        filters.holder_name,
        filters.is_physical_sale
      )
    );
  }, [
    token,
    page,
    filters.day,
    filters.order,
    filters.mostrar,
    filters.status,
    filters.payment_type,
    filters.data_inicial,
    filters.data_final,
    filters.documento,
    filters.vencimento_inicial,
    filters.vencimento_final,
    debouncedLike,
    debouncedId,
    filters.pagamento_inicial,
    filters.pagamento_final,
    filters.terminal_id,
    filters.seller_like,
    filters.holder_name,
    filters.is_physical_sale,
  ]);

  const handleClickRow = (row) => {
    const path = generatePath(
      "/dashboard/gerenciar-contas/:id/detalhes-transacao",
      {
        id: row.transaction_id,
      }
    );
    history.push(path);
  };

  const handleExportarTransacao = async () => {
    setLoading(true);
    const res = await dispatch(
      loadExportHistoricoTransacao(
        token,
        page,
        filters.day,
        filters.order,
        filters.mostrar,
        filters.status,
        debouncedLike,
        filters.payment_type,
        filters.data_inicial,
        filters.data_final,
        debouncedId,
        filters.documento,
        filters.vencimento_inicial,
        filters.vencimento_final,
        filters.pagamento_inicial,
        filters.pagamento_final,
        "",
        filters.terminal_id,
        filters.seller_like,
        filters.holder_name,
        filters.is_physical_sale
      )
    );
    toast.warning(
      res?.message ?? "A exportação pode demorar um pouco, por favor aguarde..."
    );
    if (res?.url) {
      window.open(`${res.url}`, "", "");
    }
    setLoading(false);
  };

  const Editar = (row) => {
    const [anchorEl, setAnchorEl] = useState(null);
    return <></>;
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.headerContainer}>
        <Box
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography className={classes.pageTitle}>
            Histórico de Transações
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
          <Box style={{ marginTop: "8px", margin: 40 }} display="flex">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <TextField
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Filtrar por EC (nome, documento, cnpj, e-mail...)"
                  fullWidth
                  label="EC"
                  value={filters.seller_like}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      seller_like: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Filtrar por pagador (nome, documento, e-mail...)"
                  fullWidth
                  label="Pagador"
                  value={filters.like}
                  onChange={(e) =>
                    setFilters({ ...filters, like: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Filtrar por ID da transação ou conciliação"
                  fullWidth
                  label="ID da transação ou conciliação"
                  value={filters.id}
                  onChange={(e) =>
                    setFilters({ ...filters, id: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Select
                  style={{
                    color: APP_CONFIG.mainCollors.secondary,
                    marginTop: 10,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filters.day}
                  onChange={(e) =>
                    setFilters({ ...filters, day: e.target.value })
                  }
                >
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value=" "
                  >
                    Período
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value={1}
                  >
                    Hoje
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value={7}
                  >
                    Últimos 7 dias
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value={15}
                  >
                    Últimos 15 dias
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value={30}
                  >
                    Últimos 30 dias
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value={60}
                  >
                    Últimos 60 dias
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value={90}
                  >
                    Últimos 90 dias
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Select
                  style={{
                    color: APP_CONFIG.mainCollors.secondary,
                    marginTop: 10,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value=" "
                  >
                    Situação
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="succeeded"
                  >
                    Sucesso
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="canceled"
                  >
                    Cancelada
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="failed"
                  >
                    Falhada
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="charged_back"
                  >
                    Charged Back
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="dispute"
                  >
                    Em Disputa
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="pending"
                  >
                    Pendente
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="pre_authorized"
                  >
                    Pré-autorização
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="reversed"
                  >
                    Revertida
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="new"
                  >
                    Nova
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="requested"
                  >
                    Boleto - Canc. Solicitado
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="refused"
                  >
                    Boleto - Canc. Recusado por status
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="rejected"
                  >
                    Boleto - Canc. Rejeitado
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="error"
                  >
                    Boleto - Erro Cancelamento
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="finished"
                  >
                    Boleto - Canc. Finalizado
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Select
                  style={{
                    color: APP_CONFIG.mainCollors.secondary,
                    marginTop: 10,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filters.payment_type}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      payment_type: e.target.value,
                    })
                  }
                >
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value=" "
                  >
                    Método
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="debit"
                  >
                    Débito
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="credit"
                  >
                    Crédito
                  </MenuItem>

                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="commission"
                  >
                    Comissão
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Select
                  style={{
                    color: APP_CONFIG.mainCollors.secondary,
                    marginTop: 10,
                  }}
                  variant="outlined"
                  fullWidth
                  value={filters.is_physical_sale}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      is_physical_sale: e.target.value,
                    })
                  }
                >
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value=" "
                  >
                    Tipo de Venda
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="1"
                  >
                    CP - Captura Presencial
                  </MenuItem>
                  <MenuItem
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                    value="0"
                  >
                    CNP - Captura Não Presencial
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  label="Data Inicial"
                  value={filters.data_inicial}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      data_inicial: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  label="Data Final"
                  value={filters.data_final}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      data_final: e.target.value,
                    })
                  }
                />
              </Grid>
              {filters.payment_type === "boleto" ||
              filters.payment_type === "credit" ||
              filters.payment_type === "debit" ? null : (
                <>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="Filtrar por ID do POS"
                      fullWidth
                      label="ID do POS"
                      value={filters.terminal_id}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          terminal_id: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </>
              )}

              {filters.payment_type === "credit" ||
              filters.payment_type === "debit" ? (
                <>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="Nome do portador do Cartão"
                      fullWidth
                      label="Portador do Cartão"
                      value={filters.holder_name}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          holder_name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </>
              ) : null}

              {filters.payment_type === "boleto" ? (
                <>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      label="Vencimento Data Inicial"
                      value={filters.vencimento_inicial}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          vencimento_inicial: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      label="Vencimento Data Final"
                      value={filters.vencimento_final}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          vencimento_final: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      label="Pagamento Data Inicial"
                      value={filters.pagamento_inicial}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          pagamento_inicial: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        pattern: "d {4}- d {2}- d {2} ",
                      }}
                      type="date"
                      label="Pagamento Data Final"
                      value={filters.pagamento_final}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          pagamento_final: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="Filtrar por N° Documento"
                      fullWidth
                      label="N° Documento"
                      value={filters.documento}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          documento: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </>
              ) : null}
              <Grid item xs={12} sm={2}>
                <Box display="flex">
                  <Tooltip title="Limpar Filtros">
                    <IconButton
                      onClick={() =>
                        setFilters({
                          ...filters,
                          id: "",
                          day: " ",
                          order: " ",
                          mostrar: " ",
                          status: " ",
                          like: "",
                          payment_type: " ",
                          data_inicial: "",
                          data_final: "",
                          documento: "",
                          vencimento_final: "",
                          vencimento_inicial: "",
                          terminal_id: "",
                          terminal_name: "",
                          holder_name: "",
                          is_physical_sale: " ",
                          seller_like: "",
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Exportar Excel">
                    <IconButton
                      variant="outlined"
                      style={{ marginLeft: "6px" }}
                      onClick={handleExportarTransacao}
                    >
                      <FontAwesomeIcon icon={faTable} color="green" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Typography
            className={classes.pageTitle}
            style={{ marginLeft: "30px", marginBottom: "30px" }}
          >
            CONTAS RECENTES
          </Typography>
        </Box>
        <Box className={classes.tableContainer}>
          {historico.data && historico.per_page ? (
            <Box minWidth={!matches ? "800px" : null}>
              <TableContainer style={{ overflowX: "auto" }}>
                <CustomTable
                  columns={columns ? columns : null}
                  data={historico.data}
                  Editar={Editar}
                  handleClickRow={handleClickRow}
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
              count={historico.last_page}
              onChange={handleChangePage}
              page={page}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ListaTransacoesGerais;
