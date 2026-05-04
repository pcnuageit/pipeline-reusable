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
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  loadExportPartnerTransactions,
  loadPartnerTransactions,
} from "../../actions/actions";

/* import CustomTable from '../../components/CustomTablePartner/CustomTable'; */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RefreshIcon from "@material-ui/icons/Refresh";
import Pagination from "@material-ui/lab/Pagination";
import NumberFormat from "react-number-format";
import { toast } from "react-toastify";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import columns from "./JeittoTransactionsColumns";

const JeittoAdm = () => {
  const token = useAuth();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const history = useHistory();
  const historico = useSelector((state) => state.partnerTransactions);
  const exportTransacao = useSelector((state) => state.exportTransacao);
  const userData = useSelector((state) => state.userData);
  const id = useParams()?.id ?? "";

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const [filters, setFilters] = useState({
    day: "",
    order: " ",
    mostrar: " ",
    status: " ",
    cpf: "",
    nsu_transaction: " ",
    email: "",
    name: "",
    ddd_phone: "",
    value: "",
    expiration_date_start: "",
    expiration_date_end: "",
    created_at_between_start: "",
    created_at_between_end: "",
    value_start: "",
    value_end: "",
    agency_code: "",
  });
  const debouncedName = useDebounce(filters.name, 800);
  const debouncedAgencyCode = useDebounce(filters.agency_code, 800);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(
      loadPartnerTransactions(
        token,
        page,
        filters.order,
        filters.status,
        filters.mostrar,
        filters.cpf,
        filters.expiration_date_start,
        filters.expiration_date_end,
        filters.created_at_between_start,
        filters.created_at_between_end,
        filters.nsu_transaction,
        filters.email,
        debouncedName,
        filters.ddd_phone,
        filters.value_start,
        filters.value_end,
        debouncedAgencyCode
      )
    );
  }, [
    debouncedAgencyCode,
    debouncedName,
    dispatch,
    filters.cpf,
    filters.created_at_between_end,
    filters.created_at_between_start,
    filters.ddd_phone,
    filters.email,
    filters.expiration_date_end,
    filters.expiration_date_start,
    filters.mostrar,
    filters.nsu_transaction,
    filters.order,
    filters.status,
    filters.value_end,
    filters.value_start,
    page,
    token,
  ]);

  useEffect(() => {
    return () => {
      setFilters({ ...filters });
    };
  }, []);

  const [loading, setLoading] = useState(false);

  const handleExportarTransacao = async () => {
    setLoading(true);
    const res = await dispatch(
      loadExportPartnerTransactions(
        token,
        page,
        filters.order,
        filters.status,
        filters.mostrar,
        filters.cpf,
        filters.expiration_date_start,
        filters.expiration_date_end,
        filters.created_at_between_start,
        filters.created_at_between_end,
        filters.nsu_transaction,
        filters.email,
        filters.name,
        filters.ddd_phone,
        filters.value_start,
        filters.value_end,
        filters.agency_code
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

  const rows = useMemo(() => {
    return historico.data;
  }, [historico]);

  const options = {
    /* thousandSeparator: '.',
		decimalSeparator: ',', */
    allowNegative: false,

    customInput: TextField,
    /* style: { width: '100%' }, */
  };

  return (
    <Box display="flex" flexDirection="column" style={{ marginBottom: 30 }}>
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
          Transações Jeitto
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
        <Box
          style={{
            margin: 30,
            padding: "15px",
            /* backgroundColor: 'green', */
          }}
          display="flex"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Filtrar pelo nome"
                fullWidth
                label="Nome"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Filtrar por cpf"
                fullWidth
                label="CPF"
                value={filters.cpf}
                onChange={(e) =>
                  setFilters({ ...filters, cpf: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Filtrar por email"
                fullWidth
                label="Email"
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Filtrar por cpf"
                fullWidth
                label="NSU da transação"
                value={filters.nsu_transaction}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    nsu_transaction: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Select
                style={{
                  marginTop: "10px",
                  color: APP_CONFIG.mainCollors.secondary,
                }}
                variant="outlined"
                fullWidth
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <MenuItem
                  value={" "}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Status
                </MenuItem>
                <MenuItem
                  value={"0"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Pendente
                </MenuItem>
                <MenuItem
                  value={"1"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Expirada
                </MenuItem>
                <MenuItem
                  value={"2"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Confirmada
                </MenuItem>
                <MenuItem
                  value={"3"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Sem limite
                </MenuItem>
                <MenuItem
                  value={"4"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Erro
                </MenuItem>
                <MenuItem
                  value={"5"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Sem limite POS/PRE
                </MenuItem>
                <MenuItem
                  value={"6"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Valor não alcançado
                </MenuItem>
                <MenuItem
                  value={"7"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Limite bloqueado
                </MenuItem>
                <MenuItem
                  value={"8"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Negado
                </MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  pattern: "d {4}- d {2}- d {2} ",
                }}
                type="date"
                label="Data de criação inicial"
                value={filters.created_at_between_start}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    created_at_between_start: e.target.value,
                  })
                }
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
                label="Data de criação final"
                value={filters.created_at_between_end}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    created_at_between_end: e.target.value,
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
                label="Data de expiração Inicial"
                value={filters.expiration_date_start}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    expiration_date_start: e.target.value,
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
                label="Data de expiração Final"
                value={filters.expiration_date_end}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    expiration_date_end: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              {/* <label htmlFor="sale_value">Valor de Venda</label>
							<CurrencyInput
								style={{
									borderRadius: 27,
									height: '45px',
									borderWidth: '10px',
									borderColor: 'white',
									borderLeftColor: 'white',
									borderTopColor: 'white !important',
									backgroundColor: APP_CONFIG.mainCollors.backgrounds,
								}}
								aria-label="Valor inicial"
								prefix="R$"
								id="input-example"
								name="input-name"
								placeholder="R$"
								
								decimalsLimit={2}
								onValueChange={(e) =>
									setFilters({
										...filters,
										value_end: e.target.value
											.replace('.', '')
											.replace(',', '.'),
									})
								}
							/> */}

              <NumberFormat
                isNumericString={true}
                InputLabelProps={{ shrink: true }}
                {...options}
                variant="outlined"
                decimalPlacesShownOnFocus={0}
                maxLength={7}
                label="Valor Inicial"
                placeholder="R$"
                decimalSeparator=","
                thousandSeparator="."
                value={filters.value_start}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    value_start: e.target.value
                      .replace(".", "")
                      .replace(",", "."),
                  })
                }
              />

              {/* <CurrencyInput
								InputLabelProps={{ shrink: true }}
								variant="outlined"
								{...options}
								customInput={TextField}
								id="input-example"
								name="input-name"
								placeholder="Please enter a number"
								decimalsLimit={2}
								value={filters.value_start}
								onValueChange={(e) =>
									setFilters({
										...filters,
										value_start: e.target.value
											.replace('.', '')
											.replace(',', '.'),
									})
								}
							/> */}
            </Grid>
            <Grid item xs={12} sm={2}>
              <NumberFormat
                isNumericString={true}
                InputLabelProps={{ shrink: true }}
                {...options}
                variant="outlined"
                decimalPlacesShownOnFocus={0}
                maxLength={7}
                label="Valor Final"
                placeholder="R$"
                decimalSeparator=","
                thousandSeparator="."
                value={filters.value_end}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    value_end: e.target.value
                      .replace(".", "")
                      .replace(",", "."),
                  })
                }
              />
              {/* <CurrencyTextField
								variant="outlined"
								decimalPlacesShownOnFocus={0}
								currencySymbol="R$"
								maximumValue={1000000}
								minimumValue={0}
								label="Valor Final"
								decimalCharacter=","
								digitGroupSeparator="."
								value={filters.value_end}
								onChange={(e) =>
									setFilters({
										...filters,
										value_end: e.target.value
											.replace('.', '')
											.replace(',', '.'),
									})
								}
							/> */}
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Filtrar pelo código"
                fullWidth
                label="Código Agência"
                value={filters.agency_code}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    agency_code: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box display="flex" width="100%" justifyContent="flex-end">
                <Tooltip title="Limpar Filtros">
                  <IconButton
                    onClick={() =>
                      setFilters({
                        ...filters,
                        day: "",
                        order: " ",
                        mostrar: " ",
                        status: " ",
                        cpf: "",
                        nsu_transaction: " ",
                        email: "",
                        name: "",
                        ddd_phone: "",
                        value: "",
                        expiration_date_start: "",
                        expiration_date_end: "",
                        created_at_between_start: "",
                        created_at_between_end: "",
                        value_start: "",
                        value_end: "",
                        agency_code: "",
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
      <Box style={{ marginTop: "1px" }}>
        {historico.data && historico.per_page ? (
          <Box minWidth={!matches ? "800px" : null}>
            <CustomTable
              columns={columns}
              data={rows}
              /* handleClickRow={handleClickRow} */
            />
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
          <IconButton
            style={{
              backgroundColor: "white",
              boxShadow: "0px 0px 5px 0.7px grey",
            }}
            onClick={() => window.location.reload(false)}
          >
            <RefreshIcon></RefreshIcon>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default JeittoAdm;
