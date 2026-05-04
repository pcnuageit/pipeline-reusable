import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useHistory, useParams } from "react-router-dom";
import { loadListarProdutosGiftCardAdmin } from "../../actions/actions";
import CustomTable from "../../components/CustomTable/CustomTable";
import { APP_CONFIG } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import useDebounce from "../../hooks/useDebounce";
import { documentMask } from "../../utils/documentMask";

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data) => {
      /* const date = new Date(data);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return (
				<Box display="flex" justifyContent="center">
					<FontAwesomeIcon icon={faCalendarAlt} size="lg" />
					<Typography style={{ marginLeft: '6px' }}>
						{formatted}
					</Typography>
				</Box>
			); */
      return (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
          {moment.utc(data).format("DD MMMM YYYY, HH:mm")}
        </Box>
      );
    },
  },
  {
    headerText: "Nome",
    key: "conta.nome",
    CustomValue: (value) => <Typography>{value}</Typography>,
  },
  {
    headerText: "Documento",
    key: "conta.documento",
    CustomValue: (value) => {
      return (
        <Typography
          style={{ color: value ? APP_CONFIG.mainCollors.primary : "red" }}
        >
          {value ? documentMask(value) : "Não cadastrado"}
        </Typography>
      );
    },
  },
  {
    headerText: "Produto",
    key: "valor_celcoin",
    CustomValue: (value) => <Typography>{value}</Typography>,
  },
  {
    headerText: "Id da transferência",
    key: "transaction_p2p_id",
    CustomValue: (value) => {
      return (
        <Typography
          style={{ color: value ? APP_CONFIG.mainCollors.primary : "red" }}
        >
          {value ? value : "Não realizada"}
        </Typography>
      );
    },
  },
  {
    headerText: "Id Celcoin",
    key: "transaction_celcoin_id",
    CustomValue: (value) => <Typography>{value}</Typography>,
  },
  {
    headerText: "Situação",
    key: "status",
    CustomValue: (status) => {
      if (
        status === "SUCESSO" ||
        status === "Confirmada" ||
        status === "Aprovado" ||
        status === "Criada"
      ) {
        return (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              style={{
                borderRadius: 32,
                backgroundColor: "#C9ECE7",
                maxWidth: "120px",
                padding: "5px",
              }}
            >
              <Typography style={{ color: "#00B57D", width: "100%" }}>
                {status}
              </Typography>
            </Box>
          </Box>
        );
      }
      if (status === "Pendente") {
        return (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              style={{
                borderRadius: 32,
                backgroundColor: "#F1E3D4",
                maxWidth: "120px",
                padding: "5px",
              }}
            >
              <Typography style={{ color: "orange", width: "100%" }}>
                {status}
              </Typography>
            </Box>
          </Box>
        );
      }
      return (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            style={{
              borderRadius: 32,
              backgroundColor: "#ECC9D2",
              maxWidth: "120px",
              padding: "5px",
            }}
          >
            <Typography style={{ color: "#ED757D", width: "100%" }}>
              {status}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    headerText: "Valor",
    key: "valor",
    CustomValue: (valor) => {
      return (
        <Typography>
          R$ <b>{valor}</b>
        </Typography>
      );
    },
  },
];

const GiftCardsList = () => {
  const token = useAuth();
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const id = useParams()?.id ?? "";
  const userData = useSelector((state) => state.userData);
  const [filters, setFilters] = useState({
    day: "",
    order: " ",
    mostrar: " ",
    status: " ",
    cpf: "",
    nsu_transaction: " ",
    name: "",
    value: "",
    created_at_between_start: "",
    created_at_between_end: "",
    value_start: "",
    value_end: "",
    id_transaction: "",
  });
  const debouncedLike = useDebounce(filters.name, 800);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const giftCards = useSelector((state) => state.giftCards);

  moment.locale("pt-br");

  useEffect(() => {
    dispatch(
      loadListarProdutosGiftCardAdmin(
        token,
        page,
        debouncedLike,
        filters.cpf,
        filters.status,
        filters.created_at_between_start,
        filters.created_at_between_end,
        filters.nsu_transaction,
        filters.id_transaction,
        filters.value_start,
        filters.value_end,
        filters.order,
        filters.mostrar
      )
    );
  }, [
    page,
    filters.order,
    filters.mostrar,
    debouncedLike,
    filters.cpf,
    filters.status,
    filters.created_at_between_start,
    filters.created_at_between_end,
    filters.nsu_transaction,
    filters.id_transaction,
    filters.value_start,
    filters.value_end,
  ]);

  const handleChangePage = (e, value) => {
    setPage(value);
  };

  const handleClickRow = async (row) => {
    if (row.id) {
      const path = generatePath(
        "/dashboard/gerenciar-contas/" +
          row.conta.id +
          "/detalhes-gift-card/:giftCardId",
        {
          id: row.conta.id,
          giftCardId: row.id,
        }
      );
      history.push(path);
    } else {
      return null;
    }
  };

  const options = {
    /* thousandSeparator: '.',
		decimalSeparator: ',', */
    allowNegative: false,

    customInput: TextField,
    /* style: { width: '100%' }, */
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={matches ? "column" : null}
      >
        <Typography
          style={{
            marginTop: "8px",
            color: APP_CONFIG.mainCollors.primary,
            marginBottom: "30px",
          }}
          variant="h4"
        >
          GiftCards
        </Typography>
      </Box>
      {/* <Box marginTop="16px" marginBottom="16px">
				{<SearchBar
					fullWidth
					placeholder="Pesquisar por nome, documento..."
					value={filters.like}
					onChange={(e) =>
						setFilters({
							...filters,
							like: e.target.value,
						})
					}
				/> }
			</Box> */}

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
            {/* <Grid item xs={12} sm={3}>
						<TextField
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
					</Grid> */}
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Filtrar por NSU da Provider"
                fullWidth
                label="NSU da Provider"
                value={filters.nsu_transaction}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    nsu_transaction: e.target.value,
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
                placeholder="Filtrar pelo Id da transferência"
                fullWidth
                label="Id da transferência"
                value={filters.id_transaction}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    id_transaction: e.target.value,
                  })
                }
              />
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

            {/* <Grid item xs={12} sm={2}>
						<TextField
							fullWidth
							InputLabelProps={{
								shrink: true,
								pattern: 'd {4}- d {2}- d {2} ',
							}}
							type="date"
							label="Data de expiração Inicial"
							value={filters.expiration_date_start}
							onChange={(e) =>
								setFilters({ ...filters, expiration_date_start: e.target.value })
							}
						/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField
							fullWidth
							InputLabelProps={{
								shrink: true,
								pattern: 'd {4}- d {2}- d {2} ',
							}}
							type="date"
							label="Data de expiração Final"
							value={filters.expiration_date_end}
							onChange={(e) =>
								setFilters({ ...filters, expiration_date_end: e.target.value })
							}
						/>
					</Grid> */}

            <Grid item xs={12} sm={2}>
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
                value={filters.value_start}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    value_end: e.target.value
                      .replace(".", "")
                      .replace(",", "."),
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Select
                style={{ color: APP_CONFIG.mainCollors.secondary }}
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
                  value={"Nao"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  Não Confirmado
                </MenuItem>
                <MenuItem
                  value={"SUCESSO"}
                  style={{ color: APP_CONFIG.mainCollors.secondary }}
                >
                  SUCESSO
                </MenuItem>
              </Select>
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
                        name: "",
                        value: "",
                        created_at_between_start: "",
                        created_at_between_end: "",
                        value_start: "",
                        value_end: "",
                        id_transaction: "",
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="Exportar Excel">
								<IconButton
									variant="outlined"
									style={{ marginLeft: '6px' }}
									onClick={handleExportarTransacao}
								>
									<FontAwesomeIcon icon={faTable} color="green" />
								</IconButton>
							</Tooltip> */}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {giftCards.data && giftCards.per_page ? (
        <Box minWidth={!matches ? "800px" : null} style={{ marginTop: "1px" }}>
          <CustomTable
            columns={columns}
            data={giftCards.data}
            handleClickRow={handleClickRow}
          />
        </Box>
      ) : (
        <LinearProgress />
      )}
      <Box alignSelf="flex-end" marginTop="8px">
        <Pagination
          variant="outlined"
          color="secondary"
          size="large"
          count={giftCards.last_page}
          onChange={handleChangePage}
          page={page}
        />
      </Box>
    </Box>
  );
};

export default GiftCardsList;
