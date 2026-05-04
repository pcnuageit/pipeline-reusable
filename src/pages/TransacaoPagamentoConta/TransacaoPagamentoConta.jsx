/* eslint-disable no-lone-blocks */

import "../../fonts/Montserrat-SemiBold.otf";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Pagination } from "@material-ui/lab";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";
import { getPagamentoContaAction } from "../../actions/actions";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomTable from "../../components/CustomTable/CustomTable";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { APP_CONFIG } from "../../constants/config";
import { filters_gerenciar_contas } from "../../constants/localStorageStrings";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";
import px2vw from "../../utils/px2vw";

const TransacaoPagamentoConta = () => {
  const [filters, setFilters] = useState({
    nome: "",
    documento: "",
    cnpj: "",
    email: "",
    id: "",
    status: "",
    data_inicial: "",
    data_final: "",
  });

  const [filtersComparation] = useState({
    nome: "",
    documento: "",
    cnpj: "",
    email: "",
    id: "",
    status: "",
    data_inicial: "",
    data_final: "",
  });

  const debouncedNome = useDebounce(filters.nome, 800);
  const debouncedId = useDebounce(filters.id, 800);
  const debouncedEmail = useDebounce(filters.email, 800);

  const debouncedNumeroDocumento = useDebounce(filters.documento, 800);
  const debouncedCNPJ = useDebounce(filters.cnpj, 800);

  const [loading, setLoading] = useState(false);
  const token = useAuth();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const useStyles = makeStyles((theme) => ({
    root: {
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
  const classes = useStyles();
  moment.locale("pt-br");

  useEffect(() => {
    dispatch(
      getPagamentoContaAction(
        token,
        debouncedNome,
        debouncedNumeroDocumento,
        debouncedCNPJ,
        debouncedEmail,
        debouncedId,
        filters.status,
        filters.data_inicial,
        filters.data_final,
        page
      )
    );
  }, [
    token,
    debouncedNome,
    debouncedNumeroDocumento,
    debouncedCNPJ,
    debouncedEmail,
    debouncedId,
    filters.status,
    filters.data_inicial,
    filters.data_final,
    page,
    dispatch,
  ]);

  const columns = [
    {
      headerText: "Criado em",
      key: "created_at",
      CustomValue: (data) => {
        const date = new Date(data);
        const option = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };
        const formatted = date.toLocaleDateString("pt-br", option);
        return (
          <>
            <Typography align="center"> {formatted}</Typography>
            <Typography align="center">
              {moment.utc(data).format("HH:mm:ss")}
            </Typography>
          </>
        );
      },
    },
    {
      headerText: "Nome",
      key: "",
      FullObject: (data) => (
        <Typography>
          {data?.conta?.razao_social ?? data?.conta?.nome}
        </Typography>
      ),
    },
    {
      headerText: "Documento",
      key: "",
      FullObject: (data) => (
        <Typography>
          {documentMask(data?.conta?.cnpj ?? data?.conta?.documento)}
        </Typography>
      ),
    },
    {
      headerText: "E-mail",
      key: "conta.email",
      CustomValue: (value) => <Typography>{value} </Typography>,
    },
    {
      headerText: "Status",
      key: "status",
      CustomValue: (value) => {
        if (value === "Registered") {
          return (
            <Typography
              style={{
                color: "orange",
                fontWeight: "bold",
                borderRadius: "27px",
              }}
            >
              Pendente
            </Typography>
          );
        }
        if (value === "Paid") {
          return (
            <Typography
              style={{
                color: "green",
                fontWeight: "bold",
                borderRadius: "27px",
              }}
            >
              Pago
            </Typography>
          );
        }
        if (value === "Cancel") {
          return (
            <Typography
              style={{
                color: "blue",
                fontWeight: "bold",
                borderRadius: "27px",
              }}
            >
              Estornado
            </Typography>
          );
        }
        if (value === "Error") {
          return (
            <Typography
              style={{
                color: "red",
                fontWeight: "bold",
                borderRadius: "27px",
              }}
            >
              Erro
            </Typography>
          );
        }
      },
    },

    {
      headerText: "Código de barras",
      key: "codigo_barras",
      CustomValue: (value) => (
        <Typography style={{ lineBreak: "anywhere" }}>{value}</Typography>
      ),
    },
    {
      headerText: "Valor",
      key: "valor",
      CustomValue: (valor) => {
        return (
          <>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        );
      },
    },
    {
      headerText: "Juros",
      key: "juros",
      CustomValue: (valor) => {
        return (
          <>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        );
      },
    },
    {
      headerText: "Desconto",
      key: "desconto",
      CustomValue: (valor) => {
        return (
          <>
            R${" "}
            {parseFloat(valor).toLocaleString("pt-br", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        );
      },
    },
    {
      headerText: "Id da transação",
      key: "id",
      CustomValue: (value) => (
        <Typography style={{ lineBreak: "anywhere" }}>{value}</Typography>
      ),
    },

    {
      headerText: "Descrição",
      key: "descricao",
      CustomValue: (descricao) => {
        return (
          <Tooltip title={descricao ? descricao : "Sem descrição"}>
            <Box>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Box>
          </Tooltip>
        );
      },
    },
    {
      headerText: "Aprovação",
      key: "aprovado",
      CustomValue: (value) => {
        return value === true ? (
          <Tooltip title="Transação Aprovada">
            <CheckIcon style={{ color: "green" }} value />
          </Tooltip>
        ) : value === false ? (
          <Tooltip title="Transação Não Aprovada">
            <ClearIcon style={{ color: "red" }} value />
          </Tooltip>
        ) : null;
      },
    },
  ];

  const pagamentoConta = useSelector((state) => state.pagamentoConta);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const Editar = (row) => {
    return <Box></Box>;
  };

  /* useEffect(() => {
		if (!isEqual(filters, filtersComparation)) {
			localStorage.setItem(
				filters_gerenciar_contas,
				JSON.stringify({ ...filters })
			);
		}
	}, [filters]);

	useEffect(() => {
		const getLocalFilters = JSON.parse(
			localStorage.getItem(filters_gerenciar_contas)
		);
		if (getLocalFilters) {
			setFilters(getLocalFilters);
		}
	}, []); */

  return (
    <Box className={classes.root}>
      <LoadingScreen isLoading={loading} />
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
            Transações Pagamento Conta
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por nome ou razão social"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filters.nome}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({
                      ...filters,
                      nome: e.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <TextField
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  placeholder="Pesquisar por CPF"
                  size="small"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filters.documento}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({
                      ...filters,
                      documento: e.target.value,
                    });
                  }}
                />
                {/* <InputMask
									maskChar=""
									mask={'999.999.999-99'}
									value={filters.documento}
									onChange={(e) => {
										setPage(1);
										setFilters({
											...filters,
											documento: e.target.value,
										});
									}}
								>
									{() => (
										<TextField
											variant="outlined"
											InputLabelProps={{ shrink: true }}
											fullWidth
											placeholder="Pesquisar por CPF"
											size="small"
											style={{
												marginRight: '10px',
											}}
										/>
									)}
								</InputMask> */}
              </Grid>
              <Grid item xs={12} sm={2}>
                <InputMask
                  maskChar=""
                  mask={"99.999.999/9999-99"}
                  value={filters.cnpj}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({
                      ...filters,
                      cnpj: e.target.value,
                    });
                  }}
                >
                  {() => (
                    <TextField
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      placeholder="Pesquisar por CNPJ"
                      size="small"
                      style={{
                        marginRight: "10px",
                      }}
                    />
                  )}
                </InputMask>
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
                  label="Data de criação inicial"
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
                    color: APP_CONFIG.mainCollors.secondary,
                    shrink: true,
                    pattern: "d {4}- d {2}- d {2} ",
                  }}
                  type="date"
                  label="Data de criação final"
                  value={filters.data_final}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      data_final: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por ID"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filters.id}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({
                      ...filters,
                      id: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Pesquisar por E-mail"
                  size="small"
                  variant="outlined"
                  style={{
                    marginRight: "10px",
                  }}
                  value={filters.email}
                  onChange={(e) => {
                    setPage(1);
                    setFilters({
                      ...filters,
                      email: e.target.value,
                    });
                  }}
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
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Status
                  </MenuItem>
                  <MenuItem
                    value={"Registered"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pendente
                  </MenuItem>
                  <MenuItem
                    value={"Paid"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Pago
                  </MenuItem>
                  <MenuItem
                    value={"Cancel"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Estornado
                  </MenuItem>
                  <MenuItem
                    value={"Error"}
                    style={{
                      color: APP_CONFIG.mainCollors.secondary,
                    }}
                  >
                    Error
                  </MenuItem>
                </Select>
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
                  <CustomButton
                    color="red"
                    onClick={() => {
                      setFilters(filtersComparation);
                      localStorage.setItem(
                        filters_gerenciar_contas,
                        JSON.stringify({ ...filtersComparation })
                      );
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <DeleteIcon />
                      Limpar
                    </Box>
                  </CustomButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className={classes.tableContainer}>
          {pagamentoConta.data && pagamentoConta.per_page ? (
            <Box minWidth={!matches ? "800px" : null}>
              <CustomTable
                columns={columns ? columns : null}
                data={pagamentoConta.data}
                Editar={Editar}
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
              count={pagamentoConta.last_page}
              onChange={handleChangePage}
              page={page}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TransacaoPagamentoConta;
