import { faTable, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router";
import {
  loadExportHistoricoTransacao,
  loadHistoricoTransacaoFilter,
} from "../../actions/actions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import { isEqual } from "lodash";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import { filters_historico_transacoes } from "../../constants/localStorageStrings";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import columns from "./TransactionHistoryColumns";

const TransactionHistory = () => {
  const token = useAuth();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const historico = useSelector((state) => state.historicoTransacao);
  const exportTransacao = useSelector((state) => state.exportTransacao);
  const userData = useSelector((state) => state.userData);
  const id = useParams()?.id ?? "";

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
        id,
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
    id,
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

  const [loading, setLoading] = useState(false);

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
        id,
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

  useEffect(() => {
    if (!isEqual(filters, filtersComparation)) {
      localStorage.setItem(
        filters_historico_transacoes,
        JSON.stringify({ ...filters })
      );
    }
  }, [filters]);

  useEffect(() => {
    const getLocalFilters = JSON.parse(
      localStorage.getItem(filters_historico_transacoes)
    );
    if (getLocalFilters) {
      setFilters(getLocalFilters);
      dispatch(
        loadHistoricoTransacaoFilter(
          token,
          page,
          getLocalFilters.day,
          getLocalFilters.order,
          getLocalFilters.mostrar,
          getLocalFilters.status,
          debouncedLike,
          getLocalFilters.payment_type,
          getLocalFilters.data_inicial,
          getLocalFilters.data_final,
          debouncedId,
          getLocalFilters.documento,
          getLocalFilters.vencimento_inicial,
          getLocalFilters.vencimento_final,
          getLocalFilters.pagamento_inicial,
          getLocalFilters.pagamento_final,
          id,
          filters.terminal_id,
          filters.seller_like,
          filters.holder_name,
          filters.is_physical_sale
        )
      );
    }
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <LoadingScreen isLoading={loading} />

      <Box display="flex" justifyContent="">
        <Typography
          style={{
            marginTop: "8px",
            color: APP_CONFIG.mainCollors.primary,
            marginBottom: 30,
          }}
          variant="h4"
        >
          Histórico de Transações
        </Typography>
      </Box>
      <Box
        style={{
          width: "100%",
          backgroundColor: APP_CONFIG.mainCollors.backgrounds,
          borderTopLeftRadius: 27,
          borderTopRightRadius: 27,
        }}
      >
        <Box style={{ marginTop: "8px", margin: 30 }} display="flex">
          <Grid container spacing={3}>
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
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Filtrar por ID da transação ou conciliação"
                fullWidth
                label="ID da transação ou conciliação"
                value={filters.id}
                onChange={(e) => setFilters({ ...filters, id: e.target.value })}
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
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value=" "
                >
                  Período
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value={1}
                >
                  Hoje
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value={7}
                >
                  Últimos 7 dias
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value={15}
                >
                  Últimos 15 dias
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value={30}
                >
                  Últimos 30 dias
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value={60}
                >
                  Últimos 60 dias
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
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
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value=" "
                >
                  Situação
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="succeeded"
                >
                  Sucesso
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="canceled"
                >
                  Cancelada
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="failed"
                >
                  Falhada
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="charged_back"
                >
                  Charged Back
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="dispute"
                >
                  Em Disputa
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="pending"
                >
                  Pendente
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="pre_authorized"
                >
                  Pré-autorização
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="reversed"
                >
                  Revertida
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="new"
                >
                  Nova
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="requested"
                >
                  Boleto - Canc. Solicitado
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="refused"
                >
                  Boleto - Canc. Recusado por status
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="rejected"
                >
                  Boleto - Canc. Rejeitado
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="error"
                >
                  Boleto - Erro Cancelamento
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
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
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value=" "
                >
                  Método
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="debit"
                >
                  Débito
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="credit"
                >
                  Crédito
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
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
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value=" "
                >
                  Tipo de Venda
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                  value="1"
                >
                  CP - Captura Presencial
                </MenuItem>
                <MenuItem
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
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
                        is_physical_sale: "",
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
      </Box>
      <Box marginTop="1px"></Box>
      {historico && historico.last_page ? (
        <CustomTable
          columns={columns}
          data={historico.data}
          handleClickRow={handleClickRow}
        />
      ) : (
        <LinearProgress />
      )}
      <Box alignSelf="flex-end" marginTop="8px">
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
  );
};

export default TransactionHistory;
